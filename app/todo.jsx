import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { router } from "expo-router";

export default function TodoScreen() {
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState([
    {
      id: "1",
      text: "Study React Native",
      completed: false,
    },
    {
      id: "2",
      text: "Create login page",
      completed: true,
    },
  ]);

  function addTodo() {
    if (!todoText.trim()) {
      Alert.alert("Error", "Please enter a todo.");
      return;
    }

    const newTodo = {
      id: Date.now().toString(),
      text: todoText,
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setTodoText("");
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  }

  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function logout() {
    router.replace("/");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Todo List</Text>
          <Text style={styles.subtitle}>Manage your daily tasks</Text>
        </View>

        <TouchableOpacity onPress={logout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new task..."
          placeholderTextColor="#999"
          value={todoText}
          onChangeText={setTodoText}
        />

        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks yet. Add one!</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.todoCard}>
            <TouchableOpacity
              style={styles.todoTextContainer}
              onPress={() => toggleTodo(item.id)}
            >
              <Text
                style={[
                  styles.todoText,
                  item.completed && styles.completedText,
                ]}
              >
                {item.completed ? "✓ " : "○ "}
                {item.text}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTodo(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F1F3",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#8A0022",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },
  logout: {
    color: "#8A0022",
    fontWeight: "bold",
  },
  addContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E3C6CE",
  },
  addButton: {
    backgroundColor: "#8A0022",
    width: 55,
    marginLeft: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  todoCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E3C6CE",
  },
  todoTextContainer: {
    flex: 1,
  },
  todoText: {
    fontSize: 16,
    color: "#222",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  deleteButton: {
    backgroundColor: "#FFE5EA",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteText: {
    color: "#8A0022",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 50,
    fontSize: 16,
  },
});