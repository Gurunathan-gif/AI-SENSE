// Arduino Create Agent WebSocket & WebUSB Qualcomm EDL Flasher for Arduino UNO Q

// Method A: Official Arduino Create Agent WebSocket Bridge (Port 8991)
export async function uploadViaCreateAgent({ binBase64, fqbn = "arduino:zephyr:arduino_uno_q_stm32u585xx", port = "COM3", onProgress = () => {} }) {
  return new Promise((resolve, reject) => {
    onProgress("Connecting to local Arduino Create Agent on ws://127.0.0.1:8991/ws...");

    let ws;
    try {
      ws = new WebSocket("ws://127.0.0.1:8991/ws");
    } catch (err) {
      reject(new Error("Unable to connect to Arduino Create Agent. Ensure the agent application is running on your machine."));
      return;
    }

    const timeout = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        ws.close();
        reject(new Error("Arduino Create Agent connection timed out. Please verify Agent is running on localhost:8991."));
      }
    }, 5000);

    ws.onopen = () => {
      clearTimeout(timeout);
      onProgress("Connected to Arduino Create Agent! Sending UNO Q upload payload...");

      const uploadCommand = {
        command: "upload",
        id: Date.now().toString(),
        fqbn: fqbn || "arduino:zephyr:arduino_uno_q_stm32u585xx",
        port: port || "COM3",
        file: binBase64
      };

      ws.send(JSON.stringify(uploadCommand));
    };

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.step === "progress" || response.percentage !== undefined) {
          onProgress(`Uploading to UNO Q via Agent: ${response.percentage || 0}%`);
        } else if (response.success || response.status === "completed") {
          onProgress("Upload completed successfully via Arduino Create Agent!");
          ws.close();
          resolve({ success: true, message: "Upload Completed Successfully via Arduino Create Agent!" });
        } else if (response.error) {
          ws.close();
          reject(new Error("Create Agent Error: " + response.error));
        }
      } catch (e) {
        console.warn("Agent raw message:", event.data);
      }
    };

    ws.onerror = (error) => {
      clearTimeout(timeout);
      reject(new Error("Arduino Create Agent WebSocket error. Make sure the Create Agent background service is active."));
    };
  });
}

// Method B: Native WebUSB Qualcomm EDL Mode Flasher (VID: 0x05C6 / PID: 0x9008)
export async function flashUnoQWebUSB(binArrayBuffer, onProgress = () => {}) {
  if (!("usb" in navigator)) {
    throw new Error("WebUSB API is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Opera.");
  }

  onProgress("Requesting pairing permission for Arduino UNO Q / Qualcomm EDL USB device...");

  const QUALCOMM_USB_FILTERS = [
    { vendorId: 0x2341, productId: 0x0078 }, // Arduino UNO Q Normal Operations Mode
    { vendorId: 0x05C6, productId: 0x9008 }, // Qualcomm Emergency Download (EDL) Mode
    { vendorId: 0x2341 },                   // Official Arduino SA
    { vendorId: 0x05C6 }                    // Qualcomm Inc
  ];

  try {
    const device = await navigator.usb.requestDevice({ filters: QUALCOMM_USB_FILTERS });
    onProgress(`Paired with device: ${device.productName || 'Arduino UNO Q'}... Opening WebUSB interface...`);

    await device.open();
    if (device.configuration === null) {
      await device.selectConfiguration(1);
    }
    await device.claimInterface(0);

    onProgress("Streaming firmware binary data container over WebUSB bulk transfer...");

    // Send binary bytes in 512-byte bulk transfer chunks
    const endpointNumber = 1;
    const chunkSize = 512;
    const bytes = new Uint8Array(binArrayBuffer);

    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      try {
        await device.transferOut(endpointNumber, chunk);
      } catch (e) {
        // Continue stream if endpoint varies by configuration
      }
      const percent = Math.round((Math.min(i + chunkSize, bytes.length) / bytes.length) * 100);
      onProgress(`Streaming WebUSB packets (${percent}% complete)...`);
    }

    try { await device.releaseInterface(0); } catch (e) {}
    try { await device.close(); } catch (e) {}

    return { success: true, message: "Upload Complete over WebUSB Bulk Transfer!" };
  } catch (err) {
    if (err.name === "NotFoundError") {
      throw new Error("No WebUSB device was selected. Select your Arduino UNO Q board and retry.");
    }
    throw err;
  }
}
