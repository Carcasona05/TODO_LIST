import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function History() {
  const router = useRouter();
  const [history, setHistory] = useState([
    { id: '1', text: 'Submit tax documents', doneAt: '2026-06-10' },
    { id: '2', text: 'Renew gym membership', doneAt: '2026-06-09' },
    { id: '3', text: 'Book flight to Tokyo', doneAt: '2026-06-08' },
    { id: '4', text: 'Clean garage', doneAt: '2026-06-07' },
    { id: '5', text: 'Buy birthday gift', doneAt: '2026-06-05' },
  ]);

  const clearHistory = () => setHistory([]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>✓</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.taskText}>{item.text}</Text>
        <Text style={styles.date}>Completed on {item.doneAt}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.navRow}>
          <TouchableOpacity style={styles.navBtn} onPress={() => router.replace('/home')}>
            <Text style={styles.navText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navBtn, styles.navBtnActive]} disabled>
            <Text style={styles.navTextActive}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => router.replace('/profile')}>
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>{history.length} completed tasks</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No history yet</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={history}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
          <TouchableOpacity style={styles.clearBtn} onPress={clearHistory}>
            <Text style={styles.clearText}>Clear History</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
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
    paddingBottom: 80,
  },
  card: {
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
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  icon: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  taskText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  clearBtn: {
    margin: 16,
    marginBottom: 32,
    backgroundColor: '#fee2e2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '600',
  },
});