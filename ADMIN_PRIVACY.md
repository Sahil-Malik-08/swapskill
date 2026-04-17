# Admin Privacy Protection

## Overview
Admin users are automatically hidden from public discovery to maintain their privacy and security.

## Implementation Details

### Database Query Filtering
Both public and authenticated discovery endpoints exclude admin users:

```javascript
// Public discovery (no auth required)
let query = { 
  isPublic: true, 
  isBanned: false, 
  isAdmin: { $ne: true }  // Exclude admins
};

// Authenticated discovery (requires login)
let query = { 
  isPublic: true, 
  isBanned: false, 
  isAdmin: { $ne: true },  // Exclude admins
  _id: { $ne: req.user._id }  // Exclude current user
};
```

### Affected Endpoints
1. **Public Discovery**: `/api/public/users/discover`
2. **Authenticated Discovery**: `/api/users/discover`

### Benefits
- **Security**: Admin accounts are not visible to potential attackers
- **Privacy**: Admins can browse the platform without being discovered
- **Professional**: Admins can maintain professional separation from regular users
- **Safety**: Reduces risk of targeted attacks on admin accounts

### Admin Access
Admins can still:
- Access the admin panel at `/admin`
- View all users in the admin panel
- Manage the platform through admin features
- Use all regular user features when logged in

### Regular Users
Regular users cannot:
- See admin accounts in discovery
- Send swap requests to admins
- View admin profiles publicly

## Configuration
This feature is enabled by default and cannot be disabled through the UI. 
Admins who need to be discoverable should use regular user accounts instead. 