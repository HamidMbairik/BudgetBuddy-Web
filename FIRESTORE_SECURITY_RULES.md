# Firestore Security Rules for BudgetBuddy

## Complete Security Rules

Copy and paste these rules into your Firebase Console → Firestore Database → Rules tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // User profiles collection
    match /users/{userId} {
      // Users can read and write their own profile
      allow read, write: if isOwner(userId);
      
      // Transactions subcollection
      match /transactions/{transactionId} {
        // Users can read and write their own transactions
        allow read, write: if isOwner(userId);
      }
      
      // Notes subcollection
      match /notes/{noteId} {
        // Users can read and write their own notes
        allow read, write: if isOwner(userId);
      }
    }
  }
}
```

## How to Apply These Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Replace the existing rules with the code above
6. Click **Publish** to save the rules

## What These Rules Do

- **User Profiles**: Users can only read/write their own profile data
- **Transactions**: Users can only access transactions in their own subcollection
- **Notes**: Users can only access notes in their own subcollection
- **Security**: All operations require authentication
- **Isolation**: Users cannot access other users' data

## Testing the Rules

After applying the rules, test them:

1. **Test Read Access**: Try to read your own data (should work)
2. **Test Write Access**: Try to create a transaction (should work)
3. **Test Unauthorized Access**: Try to access another user's data (should fail)

## Important Notes

- These rules use **subcollections** (`users/{userId}/transactions/{id}`)
- This provides better security and organization
- Each user's data is isolated in their own subcollection
- Rules are enforced server-side by Firebase

## Troubleshooting

If you get "Permission denied" errors:

1. **Check Authentication**: Make sure user is logged in
2. **Check User ID**: Verify `currentUser.uid` matches the document path
3. **Check Rules**: Ensure rules are published in Firebase Console
4. **Check Collection Path**: Verify you're using the correct path structure

## Development vs Production

For development, you might want more permissive rules temporarily:

```javascript
// DEVELOPMENT ONLY - NOT FOR PRODUCTION
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ WARNING**: Never use the development rules in production! They allow any authenticated user to access any data.

