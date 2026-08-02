// Shared live telemetry service to interconnect RUN Studio and QC Diagnostics

let latestTelemetry = {
  rawLogs: [],
  parsedData: {},
  timestamp: null,
  source: 'RUN Studio Serial Stream'
};

const listeners = new Set();

export const updateLiveTelemetry = (parsedData, rawLine) => {
  latestTelemetry = {
    rawLogs: rawLine ? [...latestTelemetry.rawLogs.slice(-100), `[${new Date().toLocaleTimeString()}] ${rawLine}`] : latestTelemetry.rawLogs,
    parsedData: { ...latestTelemetry.parsedData, ...parsedData },
    timestamp: new Date().toLocaleTimeString(),
    source: 'RUN Studio Live WebSerial Output'
  };

  try {
    localStorage.setItem('aisense_latest_telemetry', JSON.stringify(latestTelemetry));
  } catch (e) {}

  listeners.forEach(cb => cb(latestTelemetry));
};

export const getLatestTelemetry = () => {
  if (!latestTelemetry.timestamp) {
    try {
      const saved = localStorage.getItem('aisense_latest_telemetry');
      if (saved) latestTelemetry = JSON.parse(saved);
    } catch (e) {}
  }
  return latestTelemetry;
};

export const subscribeTelemetry = (callback) => {
  listeners.add(callback);
  callback(latestTelemetry);
  return () => listeners.delete(callback);
};
