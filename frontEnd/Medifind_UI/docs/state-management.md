# State Management

## Overview

MediFind uses a combination of React's built-in state management features and custom hooks to manage application state. The state management system is designed to be scalable, maintainable, and performant.

## State Management Architecture

### Component-Level State

#### useState Hook
- Local component state
- Simple state updates
- Form handling
- UI state management

Example:
```javascript
const [medicine, setMedicine] = useState({
  name: '',
  quantity: 0,
  expiryDate: ''
});
```

#### useReducer Hook
- Complex state logic
- Multiple sub-values
- State transitions
- Action-based updates

Example:
```javascript
const [state, dispatch] = useReducer(medicineReducer, initialState);
```

### Global State

#### Context API
- User authentication
- Theme preferences
- Global settings
- Shared data

Example:
```javascript
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Custom Hooks

### Authentication State

#### useAuth Hook
```javascript
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const login = async (credentials) => {
    // Login logic
  };
  
  const logout = () => {
    // Logout logic
  };
  
  return { user, loading, login, logout };
};
```

### Medicine State

#### useMedicine Hook
```javascript
const useMedicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchMedicines = async () => {
    // Fetch logic
  };
  
  const addMedicine = async (medicine) => {
    // Add logic
  };
  
  return { medicines, loading, fetchMedicines, addMedicine };
};
```

## State Persistence

### Local Storage
- User preferences
- Authentication tokens
- Form data
- UI settings

Example:
```javascript
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });
  
  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
};
```

## State Updates

### Optimistic Updates
- UI updates before server response
- Error handling and rollback
- Improved user experience

Example:
```javascript
const updateMedicine = async (id, data) => {
  const previousData = medicines.find(m => m.id === id);
  
  // Optimistic update
  setMedicines(medicines.map(m => 
    m.id === id ? { ...m, ...data } : m
  ));
  
  try {
    await api.updateMedicine(id, data);
  } catch (error) {
    // Rollback on error
    setMedicines(medicines.map(m => 
      m.id === id ? previousData : m
    ));
  }
};
```

## State Synchronization

### Real-time Updates
- WebSocket connections
- Server-sent events
- Polling mechanisms

Example:
```javascript
const useRealTimeUpdates = () => {
  useEffect(() => {
    const ws = new WebSocket('ws://api.example.com/updates');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Update state based on server message
    };
    
    return () => ws.close();
  }, []);
};
```

## State Validation

### Form Validation
- Input validation
- Error messages
- Submission handling

Example:
```javascript
const validateMedicine = (medicine) => {
  const errors = {};
  
  if (!medicine.name) {
    errors.name = 'Name is required';
  }
  
  if (medicine.quantity <= 0) {
    errors.quantity = 'Quantity must be positive';
  }
  
  return errors;
};
```

## Performance Optimization

### Memoization
- useMemo for expensive calculations
- useCallback for function references
- React.memo for component memoization

Example:
```javascript
const MedicineList = React.memo(({ medicines, onSelect }) => {
  const filteredMedicines = useMemo(() => 
    medicines.filter(m => m.quantity > 0),
    [medicines]
  );
  
  return (
    // Render logic
  );
});
```

## Error Handling

### Error State
- Error boundaries
- Error messages
- Recovery mechanisms

Example:
```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorComponent error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

## State Testing

### Unit Tests
- State initialization
- State updates
- Edge cases
- Error scenarios

Example:
```javascript
describe('useMedicine', () => {
  it('should initialize with empty medicines', () => {
    const { result } = renderHook(() => useMedicine());
    expect(result.current.medicines).toEqual([]);
  });
  
  it('should add medicine correctly', async () => {
    const { result } = renderHook(() => useMedicine());
    await act(async () => {
      await result.current.addMedicine({ name: 'Test' });
    });
    expect(result.current.medicines).toContainEqual(
      expect.objectContaining({ name: 'Test' })
    );
  });
});
```

## State Migration

### Version Updates
- State structure changes
- Data migration
- Backward compatibility

Example:
```javascript
const migrateState = (oldState) => {
  return {
    ...oldState,
    // Add new fields
    // Transform old data
    // Handle deprecated fields
  };
};
``` 