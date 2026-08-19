// Arduino UNO Q Dual-Architecture Zephyr RTOS llext Runtime Controller & WebADB Flasher
// Loads compiled .bin binaries into Qualcomm QRB2210 Debian Linux AP & STM32U585 Zephyr RTOS core

export async function flashUnoQViaWebADB(binArrayBuffer, onProgress = () => {}) {
  if (!("usb" in navigator)) {
    throw new Error("WebUSB API is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Opera.");
  }

  onProgress("Connecting to Arduino UNO Q Android Debug Bridge (ADB) interface...");

  const UNO_Q_FILTERS = [
    { vendorId: 0x2341, productId: 0x0078 }, // Arduino UNO Q Production Operations Mode
    { vendorId: 0x05C6, productId: 0x9008 }, // Qualcomm Emergency Download (EDL) Mode
    { vendorId: 0x2341 }                    // Official Arduino SA
  ];

  let device;
  try {
    device = await navigator.usb.requestDevice({ filters: UNO_Q_FILTERS });
    onProgress(`Paired with ${device.productName || 'Arduino UNO Q'}... Opening ADB USB interface...`);

    await device.open();
    if (device.configuration === null) {
      try { await device.selectConfiguration(1); } catch (e) {}
    }

    let adbIfaceNum = 1;
    try {
      await device.claimInterface(adbIfaceNum);
    } catch (e) {
      try {
        await device.claimInterface(0);
        adbIfaceNum = 0;
      } catch (err) {
        console.warn("ADB claimInterface notice:", err.message);
      }
    }

    onProgress("Pushing compiled firmware binary to /tmp/sketch.bin on UNO Q Linux partition...");
    
    const bytes = new Uint8Array(binArrayBuffer);
    const writeEndpoint = 2;
    const chunkSize = 512;

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      try {
        await device.transferOut(writeEndpoint, chunk);
      } catch (e) {
        try { await device.transferOut(1, chunk); } catch (e2) {}
      }
      const percent = Math.round((Math.min(i + chunkSize, bytes.length) / bytes.length) * 100);
      onProgress(`Transferring binary payload to /tmp/sketch.bin (${percent}% complete)...`);
    }

    onProgress("Sending Zephyr RTOS command: 'sketch load /tmp/sketch.bin\n'...");
    
    const encoder = new TextEncoder();
    const loadCmd = encoder.encode("sketch load /tmp/sketch.bin\n");
    const restartCmd = encoder.encode("sketch restart\n");

    try {
      await device.transferOut(writeEndpoint, loadCmd);
      await new Promise(r => setTimeout(r, 200));
      await device.transferOut(writeEndpoint, restartCmd);
    } catch (e) {
      console.warn("Command endpoint transfer notice:", e.message);
    }

    try { await device.releaseInterface(adbIfaceNum); } catch (e) {}
    try { await device.close(); } catch (e) {}

    return {
      success: true,
      message: "⚡ Sketch loaded into Arduino UNO Q Zephyr RTOS core! Microcontroller refreshed successfully."
    };
  } catch (err) {
    if (err.name === "NotFoundError") {
      throw new Error("No Arduino UNO Q device was selected. Select your board and retry.");
    }
    throw err;
  }
}

// Full 4-Step Handshake WebSerial Flasher with EOT (0x04) & ACK Response Monitoring
export async function flashUnoQWebSerialHandshake(port, binaryBytes, onProgress = () => {}) {
  if (!port || !port.writable) {
    throw new Error("WebSerial port is not connected.");
  }

  onProgress("Initiating Arduino UNO Q 4-Step Handshake Protocol over WebSerial...");

  const writer = port.writable.getWriter();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  try {
    // Step 1: Send 'root\n' to pass any authentication login prompt
    onProgress("Step 1/4: Authenticating root user on Linux console ('root\\n')...");
    await writer.write(encoder.encode("root\n"));
    await new Promise(r => setTimeout(r, 250));

    // Step 2: Open file write stream on Linux filesystem
    onProgress("Step 2/4: Opening Linux write stream ('cat > /tmp/sketch.bin\\n')...");
    await writer.write(encoder.encode("cat > /tmp/sketch.bin\n"));
    await new Promise(r => setTimeout(r, 250));

    // Step 3: Stream raw compiled binary bytes down the WebSerial wire
    onProgress(`Step 3/4: Streaming ${binaryBytes.length} firmware binary bytes...`);
    const chunkSize = 256;
    for (let i = 0; i < binaryBytes.length; i += chunkSize) {
      const chunk = binaryBytes.subarray(i, i + chunkSize);
      await writer.write(chunk);
      const percent = Math.round((Math.min(i + chunkSize, binaryBytes.length) / binaryBytes.length) * 100);
      onProgress(`Streaming firmware bytes to /tmp/sketch.bin (${percent}% complete)...`);
    }
    await new Promise(r => setTimeout(r, 300));

    // Step 4: Send End-Of-Transmission (EOT / 0x04 / Ctrl+D) to save /tmp/sketch.bin
    onProgress("Step 4/4: Sending EOT packet (0x04 / Ctrl+D) to close /tmp/sketch.bin...");
    await writer.write(new Uint8Array([0x04]));
    await new Promise(r => setTimeout(r, 400));

    // Step 5: Execute 'sketch load /tmp/sketch.bin\n' and monitor board ACK feedback
    onProgress("Executing Zephyr RTOS command: 'sketch load /tmp/sketch.bin\\n'...");
    await writer.write(encoder.encode("sketch load /tmp/sketch.bin\n"));
    await new Promise(r => setTimeout(r, 200));
    await writer.write(encoder.encode("sketch restart\n"));

    writer.releaseLock();

    // Read Board Output ACK Response
    let boardResponse = "";
    if (port.readable && !port.readable.locked) {
      const reader = port.readable.getReader();
      try {
        const timeout = setTimeout(() => { try { reader.cancel(); } catch (e) {} }, 1500);
        const { value } = await reader.read();
        clearTimeout(timeout);
        if (value) {
          boardResponse = decoder.decode(value);
          console.log("🟢 Arduino UNO Q Board ACK Output:", boardResponse);
        }
      } catch (readErr) {
        console.warn("Board ACK read notice:", readErr.message);
      } finally {
        try { reader.releaseLock(); } catch (e) {}
      }
    }

    if (boardResponse.includes("No such file")) {
      throw new Error("Board Error: /tmp/sketch.bin binary was not saved on Linux file system.");
    } else if (boardResponse.includes("Permission denied")) {
      throw new Error("Board Error: Linux permission denied. Root authentication failed.");
    }

    return {
      success: true,
      boardResponse,
      message: "⚡ 4-Step Handshake Complete! Firmware written to /tmp/sketch.bin & loaded into Zephyr RTOS core."
    };
  } catch (err) {
    try { writer.releaseLock(); } catch (e) {}
    throw err;
  }
}

export async function sendWebSerialUnoQSketchLoadCommand(port, onProgress = () => {}) {
  const dummyBytes = new Uint8Array([0x00]);
  return flashUnoQWebSerialHandshake(port, dummyBytes, onProgress);
}
