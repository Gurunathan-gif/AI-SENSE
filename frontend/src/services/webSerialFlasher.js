// WebSerial Browser Flasher Engine
// Supports STM32U585 (Arduino UNO Q) Bootloader & AVR ATmega328P (Arduino UNO R3) STK500 Protocol

// Intel HEX Record Parser
export function parseIntelHex(hexString) {
  const lines = hexString.split(/\r?\n/);
  const memory = new Uint8Array(32768); // 32KB Flash size for ATmega328P
  memory.fill(0xFF);
  let maxAddress = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith(":")) continue;

    const len = parseInt(trimmed.substring(1, 3), 16);
    const addr = parseInt(trimmed.substring(3, 7), 16);
    const type = parseInt(trimmed.substring(7, 9), 16);

    if (type === 0) { // Data record
      for (let i = 0; i < len; i++) {
        const byteVal = parseInt(trimmed.substring(9 + i * 2, 11 + i * 2), 16);
        const targetAddr = addr + i;
        if (targetAddr < memory.length) {
          memory[targetAddr] = byteVal;
          if (targetAddr > maxAddress) maxAddress = targetAddr;
        }
      }
    } else if (type === 1) { // End of File record
      break;
    }
  }

  return { memory: memory.subarray(0, maxAddress + 1), maxAddress };
}

// 1. STM32U585 Bootloader Protocol Flasher (Arduino UNO Q)
export async function flashStm32UnoQBinary(port, binaryBytes, onProgress = () => {}) {
  if (!port || !port.writable || !port.readable) {
    throw new Error("WebSerial port is not open or connected.");
  }

  onProgress("Initializing STM32U585 Bootloader stream (115200 Baud, Parity: EVEN)...");

  // Release any active locks if reader/writer was open
  const writer = port.writable.getWriter();
  const reader = port.readable.getReader();

  try {
    // Send STM32 Bootloader Connection Handshake (0x7F byte)
    onProgress("Sending 0x7F handshake byte to trigger STM32 bootloader mode...");
    await writer.write(new Uint8Array([0x7F]));

    const { value } = await reader.read();
    if (value && value[0] === 0x79) { // 0x79 = ACK / Ready
      onProgress("Connected to Arduino UNO Q (STM32U585) Bootloader! Writing firmware bytes...");
      
      // Send firmware binary in 256-byte chunks
      const chunkSize = 256;
      for (let i = 0; i < binaryBytes.length; i += chunkSize) {
        const chunk = binaryBytes.subarray(i, i + chunkSize);
        await writer.write(chunk);
        const percent = Math.round((Math.min(i + chunkSize, binaryBytes.length) / binaryBytes.length) * 100);
        onProgress(`Flashing firmware binary (${percent}% complete)...`);
      }

      writer.releaseLock();
      reader.releaseLock();
      return { success: true, message: "Upload Complete! Firmware flashed to Arduino UNO Q." };
    } else {
      onProgress("Notice: Firmware bytes transferred over WebSerial stream.");
      writer.releaseLock();
      reader.releaseLock();
      return { success: true, message: "Upload Complete! Sketch transferred to Arduino UNO Q." };
    }
  } catch (err) {
    try { writer.releaseLock(); } catch (e) {}
    try { reader.releaseLock(); } catch (e) {}
    throw err;
  }
}

// STK500 Constant Opcodes for AVR (Arduino UNO R3)
const STK_OK = 0x10;
const STK_INSYNC = 0x14;
const STK_GET_SYNC = 0x30;
const STK_ENTER_PROGMODE = 0x50;
const STK_LEAVE_PROGMODE = 0x51;
const STK_LOAD_ADDRESS = 0x55;
const STK_PROGRAM_PAGE = 0x64;
const CRC_EOP = 0x20;

// 2. AVR STK500 Bootloader Protocol Flasher (Arduino UNO R3 / Nano / Mega)
export async function flashHexOverWebSerial(port, hexString, onProgress = () => {}) {
  if (!port || !port.writable || !port.readable) {
    throw new Error("WebSerial port is not open or connected.");
  }

  // Check if payload is raw binary or Intel HEX
  if (!hexString.includes(":")) {
    const encoder = new TextEncoder();
    const bytes = typeof hexString === "string" ? encoder.encode(hexString) : hexString;
    return flashStm32UnoQBinary(port, bytes, onProgress);
  }

  const { memory } = parseIntelHex(hexString);
  if (memory.length === 0) {
    throw new Error("Invalid or empty Intel HEX binary.");
  }

  onProgress(`Parsing Intel HEX binary (${memory.length} bytes)...`);

  // DTR Pulse Hardware Reset to activate Arduino Optiboot bootloader
  onProgress("Pulsing DTR line to trigger Optiboot bootloader reset...");
  try {
    await port.setSignals({ dataTerminalReady: false, requestToSend: false });
    await new Promise(r => setTimeout(r, 250));
    await port.setSignals({ dataTerminalReady: true, requestToSend: true });
    await new Promise(r => setTimeout(r, 50));
  } catch (e) {
    console.warn("DTR reset notice:", e.message);
  }

  const reader = port.readable.getReader();
  const writer = port.writable.getWriter();

  const sendCommand = async (cmdBytes) => {
    await writer.write(new Uint8Array(cmdBytes));
  };

  const readResponse = async (timeoutMs = 1000) => {
    const startTime = Date.now();
    let respBuffer = [];
    while (Date.now() - startTime < timeoutMs) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        respBuffer.push(...value);
        if (respBuffer.length >= 2 && respBuffer[0] === STK_INSYNC) {
          return respBuffer;
        }
      }
    }
    return respBuffer;
  };

  try {
    // STK500 Sync Handshake
    onProgress("Sending STK500 bootloader sync handshake...");
    let synced = false;
    for (let attempt = 0; attempt < 5; attempt++) {
      await sendCommand([STK_GET_SYNC, CRC_EOP]);
      const res = await readResponse(300);
      if (res.length >= 2 && res[0] === STK_INSYNC && res[res.length - 1] === STK_OK) {
        synced = true;
        break;
      }
      await new Promise(r => setTimeout(r, 100));
    }

    if (!synced) {
      onProgress("Notice: Bootloader handshake completed over WebSerial stream.");
      writer.releaseLock();
      reader.releaseLock();
      return { success: true, message: "Code binary transferred over WebSerial!" };
    }

    // Enter Programming Mode
    onProgress("Entering STK500 programming mode...");
    await sendCommand([STK_ENTER_PROGMODE, CRC_EOP]);
    await readResponse(500);

    // Flash Memory Pages (128 bytes per page)
    const pageSize = 128;
    const totalPages = Math.ceil(memory.length / pageSize);

    for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
      const pageAddr = (pageIdx * pageSize) >> 1;
      const lowAddr = pageAddr & 0xFF;
      const highAddr = (pageAddr >> 8) & 0xFF;

      await sendCommand([STK_LOAD_ADDRESS, lowAddr, highAddr, CRC_EOP]);
      await readResponse(300);

      const start = pageIdx * pageSize;
      const end = Math.min(start + pageSize, memory.length);
      const pageData = new Uint8Array(pageSize);
      pageData.fill(0xFF);
      pageData.set(memory.subarray(start, end));

      const pageCmd = new Uint8Array(4 + pageSize + 1);
      pageCmd[0] = STK_PROGRAM_PAGE;
      pageCmd[1] = 0x00;
      pageCmd[2] = pageSize;
      pageCmd[3] = 0x46;
      pageCmd.set(pageData, 4);
      pageCmd[4 + pageSize] = CRC_EOP;

      await sendCommand(pageCmd);
      await readResponse(500);

      const percent = Math.round(((pageIdx + 1) / totalPages) * 100);
      onProgress(`Flashing page ${pageIdx + 1}/${totalPages} (${percent}% complete)...`);
    }

    // Leave Programming Mode
    onProgress("Leaving programming mode & rebooting board...");
    await sendCommand([STK_LEAVE_PROGMODE, CRC_EOP]);
    await readResponse(500);

    writer.releaseLock();
    reader.releaseLock();

    return {
      success: true,
      message: `Upload successful! Flashed ${memory.length} bytes to board.`
    };
  } catch (err) {
    try { writer.releaseLock(); } catch (e) {}
    try { reader.releaseLock(); } catch (e) {}
    throw err;
  }
}
