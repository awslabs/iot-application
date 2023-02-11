const apiResourceTable = require('./api-resource-table-properties.js');

module.exports = {
  port: 8001,
  tables: [
    {
      ...apiResourceTable,
      TableName: 'dashboard-api-e2e-test',
    }
  ],
};
