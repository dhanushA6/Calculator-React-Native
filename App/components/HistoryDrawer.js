import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';

const HistoryDrawer = ({ visible, onClose, history, fetchHistory }) => {
  const translateX = useRef(new Animated.Value(-300)).current; // Start off-screen
  const drawerWidth = 300; // Set your drawer width

  const openDrawer = () => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(translateX, {
      toValue: -drawerWidth,
      duration: 300,
      useNativeDriver: true,
    }).start(onClose);
  };

  useEffect(() => {
    if (visible) {
      openDrawer();
    } else {
      closeDrawer();
    }
  }, [visible]);

  const clearHistory = async () => {
    try {
      const response = await fetch('http://10.17.199.206:5000/history', {
        method: 'DELETE',
      });

      if (response.ok) {
    
        fetchHistory(); // Fetch updated history
      } else {
        throw new Error("Failed to clear history");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to clear history from the database.");
      console.error('Error clearing history:', error);
    }
  };

  const renderHistory = () => (
    <View style={styles.historyContainer}>
      <Text style={styles.historyTitle}>Calculation History</Text>
      {history.length > 0 ? (
        history.map((item, index) => (
          <Text key={index} style={styles.historyItem}>
            {item.expression} = {item.result}
          </Text>
        ))
      ) : (
        <Text style={styles.historyItem}>No history available</Text>
      )}
      <TouchableOpacity onPress={clearHistory}>
        <Text style={styles.clearAllText}>Clear All</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Animated.View
      style={[styles.drawerContainer, { transform: [{ translateX }] }]}
    >
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>✖</Text>
      </TouchableOpacity>
      {renderHistory()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300,
    height: '100%',
    backgroundColor: '#222',
    padding: 20,
    zIndex: 999,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  historyContainer: {
    flex: 1,
    marginTop: 50,
  },
  historyTitle: {
    fontSize: 18,
    color: '#00b3b3',
    marginBottom: 20,
  },
  historyItem: {
    fontSize: 16,
    color: '#00b3b3',
    marginBottom: 10,
  },
  clearAllText: {
    fontSize: 20,
    color: '#00b3b3',
    marginTop: 20,
    textAlign: 'left',
  },
});

export default HistoryDrawer;
