import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Types for shared state
export interface SharedAttachment {
  type: string;
  data: any;
}

export interface MaxModeState {
  chatMessages: any[];
  attachedItems: SharedAttachment[];
  currentPosition: "landing" | "catalog" | "checkout";
  currentMode: "navigator" | "copilot";
  conversationId: string | null;
  contextDocuments: any[];
}

interface MaxModeContextType {
  // State
  maxModeState: MaxModeState;
  pendingAttachments: SharedAttachment[];

  // Actions
  setMaxModeState: (state: MaxModeState) => void;
  updateMaxModeState: (updates: Partial<MaxModeState>) => void;
  addPendingAttachment: (attachment: SharedAttachment) => void;
  clearPendingAttachments: () => void;
  getPendingAttachments: () => SharedAttachment[];
  persistState: () => void;
  loadPersistedState: () => MaxModeState | null;
  clearPersistedState: () => void;
}

const defaultState: MaxModeState = {
  chatMessages: [],
  attachedItems: [],
  currentPosition: "landing",
  currentMode: "navigator",
  conversationId: null,
  contextDocuments: [],
};

const STORAGE_KEY = 'maxmode_state';
const PENDING_ATTACHMENTS_KEY = 'maxmode_pending_attachments';

const MaxModeContext = createContext<MaxModeContextType | null>(null);

export function MaxModeProvider({ children }: { children: ReactNode }) {
  const [maxModeState, setMaxModeStateInternal] = useState<MaxModeState>(defaultState);
  const [pendingAttachments, setPendingAttachments] = useState<SharedAttachment[]>([]);

  // Load persisted state on mount
  useEffect(() => {
    const persisted = loadFromStorage();
    if (persisted) {
      setMaxModeStateInternal(persisted);
    }

    // Load pending attachments
    const pending = loadPendingFromStorage();
    if (pending && pending.length > 0) {
      setPendingAttachments(pending);
    }
  }, []);

  // Helper to load from storage
  const loadFromStorage = (): MaxModeState | null => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load MaxMode state from storage:', e);
    }
    return null;
  };

  // Helper to load pending attachments from storage
  const loadPendingFromStorage = (): SharedAttachment[] => {
    try {
      const stored = sessionStorage.getItem(PENDING_ATTACHMENTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load pending attachments from storage:', e);
    }
    return [];
  };

  // Persist state to sessionStorage
  const persistState = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(maxModeState));
    } catch (e) {
      console.error('Failed to persist MaxMode state:', e);
    }
  }, [maxModeState]);

  // Load persisted state
  const loadPersistedState = useCallback((): MaxModeState | null => {
    return loadFromStorage();
  }, []);

  // Clear persisted state
  const clearPersistedState = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(PENDING_ATTACHMENTS_KEY);
      setMaxModeStateInternal(defaultState);
      setPendingAttachments([]);
    } catch (e) {
      console.error('Failed to clear MaxMode state:', e);
    }
  }, []);

  // Set full state
  const setMaxModeState = useCallback((state: MaxModeState) => {
    setMaxModeStateInternal(state);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to persist MaxMode state:', e);
    }
  }, []);

  // Update partial state
  const updateMaxModeState = useCallback((updates: Partial<MaxModeState>) => {
    setMaxModeStateInternal(prev => {
      const newState = { ...prev, ...updates };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } catch (e) {
        console.error('Failed to persist MaxMode state:', e);
      }
      return newState;
    });
  }, []);

  // Add pending attachment (from demo page to be picked up by MaxMode)
  const addPendingAttachment = useCallback((attachment: SharedAttachment) => {
    setPendingAttachments(prev => {
      // Check if already exists
      const exists = prev.some(a =>
        a.type === attachment.type &&
        (a.data.id === attachment.data.id || a.data.sku === attachment.data.sku)
      );
      if (exists) return prev;

      const newAttachments = [...prev, attachment];
      try {
        sessionStorage.setItem(PENDING_ATTACHMENTS_KEY, JSON.stringify(newAttachments));
      } catch (e) {
        console.error('Failed to persist pending attachments:', e);
      }
      return newAttachments;
    });
  }, []);

  // Clear pending attachments
  const clearPendingAttachments = useCallback(() => {
    setPendingAttachments([]);
    try {
      sessionStorage.removeItem(PENDING_ATTACHMENTS_KEY);
    } catch (e) {
      console.error('Failed to clear pending attachments:', e);
    }
  }, []);

  // Get and clear pending attachments (called by MaxMode on mount)
  const getPendingAttachments = useCallback(() => {
    const current = [...pendingAttachments];
    // Don't auto-clear - let MaxMode decide when to clear
    return current;
  }, [pendingAttachments]);

  return (
    <MaxModeContext.Provider value={{
      maxModeState,
      pendingAttachments,
      setMaxModeState,
      updateMaxModeState,
      addPendingAttachment,
      clearPendingAttachments,
      getPendingAttachments,
      persistState,
      loadPersistedState,
      clearPersistedState,
    }}>
      {children}
    </MaxModeContext.Provider>
  );
}

export function useMaxModeContext() {
  const context = useContext(MaxModeContext);
  if (!context) {
    throw new Error('useMaxModeContext must be used within a MaxModeProvider');
  }
  return context;
}

// Optional hook that doesn't throw if context is missing (for gradual adoption)
export function useMaxModeContextOptional() {
  return useContext(MaxModeContext);
}
