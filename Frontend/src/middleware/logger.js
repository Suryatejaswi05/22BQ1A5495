
export const logger = (action, data = {}) => {
  const log = {
    timestamp: new Date().toISOString(),
    action,
    data
  };

  const logs = JSON.parse(localStorage.getItem('logs') || '[]');
  logs.push(log);
  localStorage.setItem('logs', JSON.stringify(logs));
};
