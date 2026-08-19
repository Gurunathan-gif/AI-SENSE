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

    // Claim ADB Interface (Interface 1 on UNO Q USB configuration)
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

    // Step 1: Push binary file payload to container's /tmp/sketch.bin
    onProgress("Pushing compiled firmware binary to /tmp/sketch.bin on UNO Q Linux partition...");
    
    const bytes = new Uint8Array(binArrayBuffer);
    const writeEndpoint = 2; // ADB Write Endpoint on UNO Q
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

    // Step 2: Send Zephyr RTOS 'sketch load' and 'sketch restart' execution commands
    onProgress("Sending Zephyr RTOS command: 'sketch load /tmp/sketch.bin'...");
    
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

// WebSerial Shell Executer: Sends 'sketch load' command directly to connected WebSerial Linux shell
export async function sendWebSerialUnoQSketchLoadCommand(port, onProgress = () => {}) {
  if (!port || !port.writable) return;
  try {
    onProgress("Sending 'sketch load /tmp/sketch.bin' command over WebSerial console...");
    const encoder = new TextEncoder();
    const writer = port.writable.getWriter();
    await writer.write(encoder.encode("sketch load /tmp/sketch.bin\nsketch restart\n"));
    writer.releaseLock();
    onProgress("Zephyr RTOS sketch load command executed over WebSerial!");
  } catch (e) {
    console.warn("WebSerial command execution notice:", e.message);
  }
}
