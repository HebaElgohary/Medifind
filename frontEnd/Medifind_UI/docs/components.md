# Component Documentation

## Core Components

### Navigation Components

#### Navbar
- **Location**: `src/components/Navbar`
- **Description**: Main navigation bar component
- **Props**:
  ```typescript
  interface NavbarProps {
    isAuthenticated: boolean;
    userRole: string;
    onLogout: () => void;
  }
  ```
- **Features**:
  - Responsive design
  - Role-based menu items
  - User profile dropdown
  - Search functionality

#### Sidebar
- **Location**: `src/components/Sidebar`
- **Description**: Side navigation component
- **Props**:
  ```typescript
  interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    menuItems: MenuItem[];
  }
  ```
- **Features**:
  - Collapsible design
  - Nested menu support
  - Active state indicators

### Layout Components

#### MainLayout
- **Location**: `src/layout/MainLayout`
- **Description**: Main application layout
- **Props**:
  ```typescript
  interface MainLayoutProps {
    children: React.ReactNode;
    showSidebar?: boolean;
  }
  ```
- **Features**:
  - Consistent layout structure
  - Responsive design
  - Header and footer integration

#### AuthLayout
- **Location**: `src/layout/AuthLayout`
- **Description**: Authentication pages layout
- **Props**:
  ```typescript
  interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
  }
  ```
- **Features**:
  - Centered content
  - Auth-specific styling
  - Logo display

### Form Components

#### InputField
- **Location**: `src/components/forms/InputField`
- **Description**: Reusable input component
- **Props**:
  ```typescript
  interface InputFieldProps {
    label: string;
    name: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
  }
  ```
- **Features**:
  - Error handling
  - Label support
  - Validation feedback

#### Button
- **Location**: `src/components/Button`
- **Description**: Reusable button component
- **Props**:
  ```typescript
  interface ButtonProps {
    variant: 'primary' | 'secondary' | 'danger';
    size: 'sm' | 'md' | 'lg';
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
  }
  ```
- **Features**:
  - Multiple variants
  - Loading state
  - Icon support

## Page Components

### Authentication Pages

#### Login
- **Location**: `src/pages/Login`
- **Description**: User login page
- **Features**:
  - Form validation
  - Error handling
  - Remember me option
  - Password recovery link

#### Signup
- **Location**: `src/pages/signup`
- **Description**: User registration page
- **Features**:
  - Multi-step form
  - Role selection
  - Terms acceptance
  - Email verification

### Medicine Management Pages

#### MedicineList
- **Location**: `src/pages/MedicineList`
- **Description**: Medicine listing page
- **Features**:
  - Search functionality
  - Filtering options
  - Pagination
  - Sort controls

#### AddMedicine
- **Location**: `src/pages/AddMedicine`
- **Description**: Add new medicine page
- **Features**:
  - Form validation
  - Image upload
  - Category selection
  - Expiry date picker

### Donor Pages

#### DonorDashboard
- **Location**: `src/pages/DonorDashboard`
- **Description**: Donor's main dashboard
- **Features**:
  - Donation history
  - Active donations
  - Statistics
  - Quick actions

#### DonorProfile
- **Location**: `src/pages/DonorProfile`
- **Description**: Donor profile management
- **Features**:
  - Profile editing
  - Contact information
  - Preferences
  - History view

## Reusable Components

### Cards

#### MedicineCard
- **Location**: `src/components/cards/MedicineCard`
- **Description**: Medicine information card
- **Props**:
  ```typescript
  interface MedicineCardProps {
    medicine: {
      id: string;
      name: string;
      description: string;
      quantity: number;
      expiryDate: string;
    };
    onAction: (action: string) => void;
  }
  ```
- **Features**:
  - Status indicators
  - Action buttons
  - Expiry warning
  - Quantity display

#### RequestCard
- **Location**: `src/components/cards/RequestCard`
- **Description**: Medicine request card
- **Props**:
  ```typescript
  interface RequestCardProps {
    request: {
      id: string;
      medicine: string;
      quantity: number;
      status: string;
      createdAt: string;
    };
    onStatusChange: (status: string) => void;
  }
  ```
- **Features**:
  - Status management
  - Timeline view
  - Action buttons
  - Priority indicators

### Modals

#### ConfirmationModal
- **Location**: `src/components/modals/ConfirmationModal`
- **Description**: Confirmation dialog
- **Props**:
  ```typescript
  interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }
  ```
- **Features**:
  - Customizable content
  - Action buttons
  - Animation effects
  - Keyboard support

#### MedicineModal
- **Location**: `src/components/modals/MedicineModal`
- **Description**: Medicine details modal
- **Props**:
  ```typescript
  interface MedicineModalProps {
    isOpen: boolean;
    medicine: Medicine;
    onClose: () => void;
    onSave: (data: Medicine) => void;
  }
  ```
- **Features**:
  - Detailed view
  - Edit functionality
  - Image preview
  - Form validation

## Custom Hooks

### useAuth
- **Location**: `src/customHooks/useAuth`
- **Description**: Authentication hook
- **Features**:
  - Login/logout functionality
  - Token management
  - User state
  - Protected route handling

### useMedicine
- **Location**: `src/customHooks/useMedicine`
- **Description**: Medicine management hook
- **Features**:
  - CRUD operations
  - State management
  - Error handling
  - Loading states

## Styling

### Theme
- **Location**: `src/styles/theme`
- **Description**: Global theme configuration
- **Features**:
  - Color palette
  - Typography
  - Spacing
  - Breakpoints

### Global Styles
- **Location**: `src/styles/global`
- **Description**: Global CSS styles
- **Features**:
  - Reset styles
  - Utility classes
  - Animations
  - Responsive design 