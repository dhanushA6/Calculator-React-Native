import React, { useState, useRef } from "react";
import { StyleSheet, Text, View, StatusBar, SafeAreaView, TouchableOpacity } from "react-native";
import Row from "./components/Row"; // Assuming Row component is correctly implemented
import Button from "./components/Button"; // Assuming Button component is correctly implemented
import HistoryDrawer from './components/HistoryDrawer';

const MAX_EXPRESSION_LENGTH = 100;
const SERVER_URL = "http://10.17.199.206:5000/calculate";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202020",
    justifyContent: "flex-end",
  },
  value: {
    color: "#fff",
    fontSize: 40,
    textAlign: "right",
    marginRight: 20,
    marginBottom: 10,
  },
  historyButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  historyButtonText: {
    color: '#00b3b3',
    fontSize: 20,
  },
});

const App = () => {
  const [currentValue, setCurrentValue] = useState("0");
  const [history, setHistory] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://10.17.199.206:5000/history');
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const calculateExpression = async (expression) => {
    try {
      const response = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expression }),
      });

      const data = await response.json();

      if (response.ok) {
        return data.result.toString();
      } else {
        return data.error || "Invalid Expression";
      }
    } catch (error) {
      console.error(error);
      return "Error connecting to server";
    }
  };

  const handleTap = async (type, value) => {
    if (type === "equal") {
      const expression = currentValue;
      const result = await calculateExpression(expression);
      setCurrentValue(result);
    } else {
      if (currentValue.length < MAX_EXPRESSION_LENGTH) {
        setCurrentValue((prevValue) =>
          prevValue === "0" ? value : prevValue + value
        );
      }
    }
  };

  const clearLastCharacter = () => {
    setCurrentValue((prevValue) =>
      prevValue.length > 1 ? prevValue.slice(0, -1) : "0"
    );
  };

  const clearAll = () => {
    setCurrentValue("0");
  };

  const openHistoryDrawer = () => {
    fetchHistory(); // Fetch history when opening the drawer
    setIsDrawerVisible(true);
  };

  const closeHistoryDrawer = () => {
    setIsDrawerVisible(false);
  };

  const getFontSize = (value) => {
    if (value.length > 15) {
      return 24;
    } else if (value.length > 10) {
      return 32;
    } else {
      return 40;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <TouchableOpacity style={styles.historyButton} onPress={openHistoryDrawer}>
        <Text style={styles.historyButtonText}>☰</Text>
      </TouchableOpacity>

      <SafeAreaView>
        <Text style={[styles.value, { fontSize: getFontSize(currentValue) }]}>
          {currentValue}
        </Text>

        <Row>
          <Button text="C" theme="secondary" onPress={clearAll} />
          <Button text="DEL" theme="secondary" onPress={clearLastCharacter} />
          <Button text="(" onPress={() => handleTap("number", "(")} />
          <Button text=")" onPress={() => handleTap("number", ")")} />
        </Row>

        <Row>
          <Button text="7" onPress={() => handleTap("number", "7")} />
          <Button text="8" onPress={() => handleTap("number", "8")} />
          <Button text="9" onPress={() => handleTap("number", "9")} />
          <Button text="*" theme="accent" onPress={() => handleTap("number", "*")} />
        </Row>

        <Row>
          <Button text="4" onPress={() => handleTap("number", "4")} />
          <Button text="5" onPress={() => handleTap("number", "5")} />
          <Button text="6" onPress={() => handleTap("number", "6")} />
          <Button text="-" theme="accent" onPress={() => handleTap("number", "-")} />
        </Row>

        <Row>
          <Button text="1" onPress={() => handleTap("number", "1")} />
          <Button text="2" onPress={() => handleTap("number", "2")} />
          <Button text="3" onPress={() => handleTap("number", "3")} />
          <Button text="+" theme="accent" onPress={() => handleTap("number", "+")} />
        </Row>

        <Row>
          <Button text="0" onPress={() => handleTap("number", "0")} />
          <Button text="." onPress={() => handleTap("number", ".")} />
          <Button text="=" theme="accent" onPress={() => handleTap("equal")} />
          <Button text="/" theme="accent" onPress={() => handleTap("number", "/")} />
        </Row>
      </SafeAreaView>

      <HistoryDrawer
        visible={isDrawerVisible}
        onClose={closeHistoryDrawer}
        history={history}
        fetchHistory={fetchHistory}
      />
    </View>
  );
};

export default App;
