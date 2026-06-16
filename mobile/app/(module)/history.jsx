import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import API from "../../services/api";

const AUTO_DELETE_DAYS = 7;

export default function History() {
  const router = useRouter();

  const [showDeleted, setShowDeleted] = useState(false);
  const [history, setHistory] = useState([]);
  const [recentlyDeleted, setRecentlyDeleted] = useState([]);
  const [clearModalVisible, setClearModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [bulkDeleteModalVisible, setBulkDeleteModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const historyRes = await API.get("/history");
      const trashRes = await API.get("/gettrash");

      setHistory(historyRes.data || []);
      setRecentlyDeleted(trashRes.data || []);
      
    } catch (err) {
      console.log("Fetch error: ", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ── Helpers ──
  const getDaysRemaining = (deletedAt) => {
    const deletedDate = new Date(deletedAt);
    const now = new Date();
    const daysElapsed = (now.getTime() - deletedDate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(AUTO_DELETE_DAYS - daysElapsed));
  };

  // ── Clear history (move all to trash) ──
  const confirmClearHistory = () => {
    setClearModalVisible(true);
  };

  const moveAllToTrash = async () => {
    try {
      await Promise.all(
        history.map(item => 
        API.put(`/trash/${item.id}`)
        )
      );

      fetchTasks();
      setClearModalVisible(false);

    } catch (err) {
      console.log("Clear history error: ", err.respone?.data || err.message);
    }
  };

  // ── Recently deleted actions ──
  const confirmPermanentDelete = (id) => {
    setSelectedItemId(id);
    setDeleteModalVisible(true);
  };

  const confirmPermanentDeleteAll = () => {
    setBulkDeleteModalVisible(true);
  };

  const permanentlyDelete = async () => {
   try {
    if (!selectedItemId) return;

    await API.delete(`/deletetask/${selectedItemId}`);
    
    fetchTasks();

   } catch (err) {
    console.log("Delete Error:", err.response?.data || err.message);

   } finally {
    setDeleteModalVisible(false);
    setSelectedItemId(null);

   }
  };

  const permanentlyDeleteAll = async () => {
    try {
      if (!recentlyDeleted || recentlyDeleted.length === 0) return;

      await Promise.all(
        recentlyDeleted.map(item => API.delete(`/deletetask/${item.id}`))
      );

      fetchTasks();

    } catch (err) {
      console.log("Bulk Delete Error:", err.response?.data || err.message);

    } finally {
      setBulkDeleteModalVisible(false);
    }
  };

    if (loading) return <View style ={{justifyContent:"center", alignItems:"center", flex:1}}><ActivityIndicator size = "large" /></View>;

  // ── Render: History item ──
  const renderHistoryItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>✓</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.taskText}>{item.text}</Text>
        <Text style={styles.date}>Completed on {new Date(item.done_at).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  // ── Render: Recently deleted item ──
  const renderDeletedItem = ({ item }) => {
    const daysLeft = getDaysRemaining(item.deleted_at);
    return (
      <TouchableOpacity
        style={[styles.card, styles.deletedCard]}
        onPress={() => confirmPermanentDelete(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.iconWrapDeleted}>
          <Text style={styles.iconDeleted}>🗑</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.taskText, styles.deletedText]}>{item.text}</Text>
          <Text style={styles.date}>Completed on {item.done_at ? new Date(item.done_at).toLocaleDateString(): "No Date"}</Text>
          <Text style={[styles.daysLeft, daysLeft <= 3 && styles.daysLeftUrgent]}>
            Auto-deleted in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
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

        <Text style={styles.title}>
          {showDeleted ? 'Recently Deleted' : 'History'}
        </Text>
        <Text style={styles.subtitle}>
          {showDeleted
            ? `${recentlyDeleted.length} deleted item${recentlyDeleted.length !== 1 ? 's' : ''}`
            : `${history.length} completed task${history.length !== 1 ? 's' : ''}`}
        </Text>

        {/* Toggle between History / Recently Deleted */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, !showDeleted && styles.toggleBtnActive]}
            onPress={() => setShowDeleted(false)}
          >
            <Text style={[styles.toggleText, !showDeleted && styles.toggleTextActive]}>
              Completed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, showDeleted && styles.toggleBtnActive]}
            onPress={() => setShowDeleted(true)}
          >
            <Text style={[styles.toggleText, showDeleted && styles.toggleTextActive]}>
              Recently Deleted ({recentlyDeleted.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Content: Recently Deleted ── */}
      {showDeleted ? (
        recentlyDeleted.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🗑</Text>
            <Text style={styles.emptyText}>No recently deleted items</Text>
            <Text style={styles.emptySubtext}>Items moved here will auto-delete after 30 days</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={recentlyDeleted}
              keyExtractor={(item) => item.id}
              renderItem={renderDeletedItem}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity style={styles.deleteAllBtn} onPress={confirmPermanentDeleteAll}>
              <Text style={styles.deleteAllText}>Delete all permanently</Text>
            </TouchableOpacity>
          </>
        )
        
      ) : (
        /* ── Content: History ── */
        history.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No history yet</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={history}
              keyExtractor={(item) => item.id}
              renderItem={renderHistoryItem}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity style={styles.clearBtn} onPress={confirmClearHistory}>
              <Text style={styles.clearText}>Clear History</Text>
            </TouchableOpacity>
          </>
        )
      )}

      {/* ═══════════════════════════════════════════════
          MODAL: Clear History Confirmation
          ═══════════════════════════════════════════════ */}
      <Modal
        animationType="fade"
        transparent
        visible={clearModalVisible}
        onRequestClose={() => setClearModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Clear History?</Text>
            <Text style={styles.modalBody}>
              All {history.length} completed task{history.length !== 1 ? 's' : ''} will be moved to Recently Deleted.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setClearModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.moveBtn]}
                onPress={moveAllToTrash}
              >
                <Text style={styles.moveText}>Move to Trash</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ═══════════════════════════════════════════════
          MODAL: Permanent Delete Confirmation
          ═══════════════════════════════════════════════ */}
      <Modal
        animationType="fade"
        transparent
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Permanently Delete?</Text>
            <Text style={styles.modalBody}>
              This item will be permanently removed and cannot be recovered.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => {
                  setDeleteModalVisible(false);
                  setSelectedItemId(null);
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.permDeleteBtn]}
                onPress={permanentlyDelete}
              >
                <Text style={styles.permDeleteText}>Permanently Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ═══════════════════════════════════════════════
          MODAL: Permanent Delete ALL Confirmation
          ═══════════════════════════════════════════════ */}
      <Modal
        animationType="fade"
        transparent
        visible={bulkDeleteModalVisible}
        onRequestClose={() => setBulkDeleteModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Permanently Delete All?</Text>
            <Text style={styles.modalBody}>
              All {recentlyDeleted.length} items in Recently Deleted will be permanently removed and cannot be recovered.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setBulkDeleteModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.permDeleteBtn]}
                onPress={permanentlyDeleteAll}
              >
                <Text style={styles.permDeleteText}>Delete All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  /* Toggle row: Completed | Recently Deleted */
  toggleRow: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#1e293b',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  toggleTextActive: {
    color: '#fff',
  },

  list: {
    padding: 16,
    paddingBottom: 80,
  },

  /* Cards */
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
  deletedCard: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
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
  iconWrapDeleted: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  iconDeleted: {
    fontSize: 16,
  },
  info: {
    flex: 1,
  },
  taskText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '500',
  },
  deletedText: {
    color: '#7f1d1d',
  },
  date: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  daysLeft: {
    fontSize: 11,
    color: '#f59e0b',
    marginTop: 4,
    fontWeight: '600',
  },
  daysLeftUrgent: {
    color: '#dc2626',
  },

  /* Empty states */
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 6,
    textAlign: 'center',
  },

  /* Clear history button */
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

  /* Delete all permanently button (Recently Deleted) */
  deleteAllBtn: {
    margin: 16,
    marginBottom: 6,
    backgroundColor: '#7f1d1d',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteAllText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  /* Modal styles */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  modalBody: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#f1f5f9',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  moveBtn: {
    backgroundColor: '#f59e0b',
  },
  moveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  permDeleteBtn: {
    backgroundColor: '#dc2626',
  },
  permDeleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});