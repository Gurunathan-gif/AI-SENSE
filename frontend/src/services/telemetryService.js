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
    rawLogs: rawLine ? [...(latestTelemetry?.rawLogs || []).slice(-100), `[${new Date().toLocaleTimeString()}] ${rawLine}`] : (latestTelemetry?.rawLogs || []),
    parsedData: { ...(latestTelemetry?.parsedData || {}), ...(parsedData || {}) },
    timestamp: new Date().toLocaleTimeString(),
    source: 'RUN Studio Live WebSerial Output'
  };

  try {
    localStorage.setItem('aisense_latest_telemetry', JSON.stringify(latestTelemetry));
  } catch (e) {}

  listeners.forEach(cb => {
    try { cb(latestTelemetry); } catch (e) {}
  });
};

export const getLatestTelemetry = () => {
  if (!latestTelemetry || !latestTelemetry.timestamp) {
    try {
      const saved = localStorage.getItem('aisense_latest_telemetry');
      if (saved && saved !== 'undefined' && saved !== 'null') {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          latestTelemetry = parsed;
        }
      }
    } catch (e) {}
  }
  return latestTelemetry || { rawLogs: [], parsedData: {}, timestamp: null, source: 'RUN Studio Serial Stream' };
};

export const subscribeTelemetry = (callback) => {
  listeners.add(callback);
  try {
    callback(getLatestTelemetry());
  } catch (e) {}
  return () => listeners.delete(callback);
};
