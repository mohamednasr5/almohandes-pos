// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwjD9zkTr86jkJsqrAMXBfEPs0uKXoPHc",
  authDomain: "hammad-10f69.firebaseapp.com",
  projectId: "hammad-10f69",
  storageBucket: "hammad-10f69.firebasestorage.app",
  messagingSenderId: "14800830918",
  appId: "1:14800830918:web:5981d9697d7e88e88df2c7",
  databaseURL: "https://hammad-10f69-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Export functions for database operations
const FirebaseOps = {
  // Fetch all products
  getAllProducts: async () => {
    const snapshot = await database.ref('products').once('value');
    return snapshot.val() || {};
  },

  // Save order to database
  saveOrder: async (orderData) => {
    const orderId = new Date().getTime();
    await database.ref('orders/' + orderId).set({
      ...orderData,
      timestamp: new Date().toISOString()
    });
    return orderId;
  },

  // Get sales reports
  getSalesReport: async (period = 'day') => {
    const snapshot = await database.ref('orders').once('value');
    return snapshot.val() || {};
  }
};
