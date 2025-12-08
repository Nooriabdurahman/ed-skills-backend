import swaggerUi from 'swagger-ui-express';
import app from './app';
import swaggerSpec from './common/utils/swagger';
import os from 'os';

const PORT = Number(process.env.PORT) || 2040;

// Swagger setup
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((_req, res) => {
  res.status(404).json({ error: 'Route does not exist' });
});

// Function to get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Start server
app.listen(PORT, () => {
  const IP = getLocalIP();
  console.log(`Server running at:`);
  console.log(`- Local:   http://localhost:${PORT}`);
  console.log(`- Network: http://${IP}:${PORT}`);
});
