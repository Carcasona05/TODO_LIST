import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import API from "../../services/api"

export default function Home() {
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/getask");
      const safeTasks = (res.data || []).filter(Boolean);
      
      setTasks(safeTasks);
      
    } catch (err) {
      console.log("Fetch Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ADDING
  const addTask = async () => {
    if (!input.trim()) return;

    try {
      const res = await API.post("/createtask", {
        text: input.trim(),
      });

      setTasks([res.data, ...tasks]);
      setInput("");

    } catch (err) {
      console.log("Add error: ", err.response?.data || err.message);
    }
  };

  // DONE OR NOT
  const toggleDone = async(task) => {
    try {
      await API.put(`/updatetask/${task.id}`, {
        done: !task.done,
      });
      
     setTasks(
      tasks.map((t) =>
        t.id === task.id
          ? { ...t, done: !t.done }
          : t
      )
    );
    } catch (err) {
      console.log("Toggle error:", err.response?.data || err.message);
    }
  };

  // DELEETING TASK
  const deleteTask = async (id) => {
    try {
      await API.put(`/trash/${id}`);
      
      setTasks(tasks.filter((t) => t.id !== id ));
      
    } catch (err) {
      console.log("Delete error: ", err.response?.data || err.message);
    }
  };

  // EDITING TASK
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = async () => {
    if (!editText.trim()) return;

    const newText = editText.trim();

    setTasks(prev =>
      prev.map(t =>
        t.id === editingId ? { ...t, text: newText } : t
      )
    );

    try {
      await API.put(`/updatetask/${editingId}`, {
        text: newText,
      });

      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.log("Edit error:", err.response?.data || err.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskCard}>
      <TouchableOpacity onPress={() => toggleDone(item)} style={styles.checkbox}>
        <View style={[styles.checkboxInner, item.done && styles.checkboxChecked]}>
          {item.done && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      {editingId === item.id ? (
        <TextInput
          style={styles.editInput}
          value={editText}
          onChangeText={setEditText}
          onSubmitEditing={saveEdit}
          autoFocus
        />
      ) : (
        <Text style={[styles.taskText, item.done && styles.taskDone]}>
          {item.text}
        </Text>
      )}

      <View style={styles.actions}>
        {editingId === item.id ? (
          <TouchableOpacity onPress={saveEdit} style={styles.actionBtn}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity onPress={() => startEdit(item)} style={styles.actionBtn}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.actionBtn}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.navRow}>

          <TouchableOpacity style={[styles.navBtn, styles.navBtnActive]} disabled>
            <Text style={styles.navTextActive}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navBtn} onPress={() => router.replace('/history')}>
            <Text style={styles.navText}>History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navBtn} onPress={() => router.replace('/profile')}>
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>

        </View>
        <Text style={styles.title}>My Tasks</Text>
        <Text style={styles.subtitle}>{(tasks || []).filter(t => t && !t.done).length} pending</Text>
      </View>

      {loading ? (
        <ActivityIndicator size = "large"/>
      ) : (
      <FlatList
        data={(tasks || []).filter(Boolean)}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      )}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          placeholderTextColor="#9ca3af"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  navBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  navBtnActive: {
    backgroundColor: '#3b82f6',
  },
  navText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  navTextActive: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  taskText: {
    flex: 1,
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  editInput: {
    flex: 1,
    fontSize: 15,
    color: '#334155',
    borderBottomWidth: 1,
    borderBottomColor: '#3b82f6',
    paddingVertical: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editText: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: '600',
  },
  saveText: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '600',
  },
  deleteText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600',
  },
  inputBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1e293b',
  },
  addBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  addText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
  },
});