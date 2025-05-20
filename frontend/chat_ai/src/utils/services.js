
export const SaveChats = async (email) => {
const savedChatsResponse = await fetch(`http://localhost:3000/api/saved-chats?email=${encodeURIComponent(email)}`);
const savedChatsData = await savedChatsResponse.json();

if (savedChatsData.success) {
  console.log('✅ Saved chats:', savedChatsData.chats);
  // Optionally, store or use the saved chats here
  localStorage.setItem('recentChats', JSON.stringify(savedChatsData.chats));
} else {
  console.warn('⚠️ No saved chats found or error fetching them');
}
}