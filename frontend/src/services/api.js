/**
 * API Service for Industrial Equipment Failure Prediction System
 * Communicates with FastAPI backend at configurable base URL.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Checks backend health / connectivity.
 * @returns {Promise<{ ok: boolean, data?: any, error?: string }>}
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        ok: false,
        error: `Server responded with HTTP ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    return {
      ok: true,
      data,
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      return {
        ok: false,
        error: 'Backend request timed out (4s). Is the server running?',
      };
    }
    return {
      ok: false,
      error: err.message || 'Cannot connect to backend server. Connection refused.',
    };
  }
}

/**
 * Sends sensor readings to FastAPI predict endpoint.
 * @param {Object} sensorData
 * @param {string} sensorData.machine_type - 'L' | 'M' | 'H'
 * @param {number} sensorData.air_temperature - Kelvin (250 - 350)
 * @param {number} sensorData.process_temperature - Kelvin (250 - 400)
 * @param {number} sensorData.rotational_speed - rpm (>0 - 10000)
 * @param {number} sensorData.torque - Nm (0 - 200)
 * @param {number} sensorData.tool_wear - minutes (0 - 300)
 * @returns {Promise<{
 *   failure_probability: number,
 *   threshold: number,
 *   prediction: string,
 *   failure_risk_detected: boolean
 * }>}
 */
export async function predictFailure(sensorData) {
  const payload = {
    machine_type: String(sensorData.machine_type).trim().toUpperCase(),
    air_temperature: parseFloat(sensorData.air_temperature),
    process_temperature: parseFloat(sensorData.process_temperature),
    rotational_speed: parseInt(sensorData.rotational_speed, 10),
    torque: parseFloat(sensorData.torque),
    tool_wear: parseInt(sensorData.tool_wear, 10),
  };

  // Client-side guard matching backend validation
  if (payload.process_temperature < payload.air_temperature) {
    const err = new Error('Process temperature must be at least the air temperature.');
    err.status = 422;
    throw err;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (networkError) {
    const err = new Error(
      `Failed to connect to backend at ${API_BASE_URL}. Ensure FastAPI is running on port 8000.`
    );
    err.isNetworkError = true;
    throw err;
  }

  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson.detail) {
        if (Array.isArray(errorJson.detail)) {
          // Pydantic validation error format
          errorDetail = errorJson.detail
            .map((item) => `${item.loc?.slice(1).join('.') || 'field'}: ${item.msg}`)
            .join('; ');
        } else {
          errorDetail = String(errorJson.detail);
        }
      }
    } catch {
      // Non-JSON error body
      errorDetail = await response.text().catch(() => errorDetail);
    }

    const err = new Error(errorDetail);
    err.status = response.status;
    throw err;
  }

  const result = await response.json();
  return result;
}

export { API_BASE_URL };

