const path = require('path');

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // Assurez-vous que le dossier 'src' existe
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/, // Pour gérer les fichiers JS/TS/TSX
        use: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  },
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 3000, // Change le port si nécessaire
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  }
};
