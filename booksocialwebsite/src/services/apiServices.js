import api from './api';

// ==================== AUTH & USER ====================
export const authService = {
  register: (data) => api.post('/auth/register', data), // RegisterRequest
  logout: () => api.post('/auth/logout'),
  login: (data) => api.post('/auth/login', data), // LoginRequest
  googleLogin: (idToken) => api.post('/auth/google', { idToken }), // GoogleLoginRequest
  getMyInfo: () => api.get('/users/my-info'),
  updateMyInfo: (formData) => api.put('/users/my-info', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMyAttempts: (page = 0, size = 6) => api.get(`/users/my-attempts?page=${page}&size=${size}`),
  changePassword: (data) => api.put('/users/change-password', data),
  getMyBookshelf: () => api.get('/users/bookshelfs'),
  getMyBookshelfFavorite: () => api.get('/users/bookshelfs/favorite'),
  getMyBooks: (page = 0, size = 10) => api.get(`/users/books?page=${page}&size=${size}`),

  //admin user
  getAllUsers: (page = 0, size = 10) => api.get(`/users?page=${page}&size=${size}`),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  getUserBooks: (userId) => api.get(`/users/${userId}/books`),
  changeStatusUser: (userId) => api.put(`/users/${userId}/change-status`),
};

// ==================== CATEGORIES ====================
export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ==================== BOOKS & CHAPTERS ====================
export const bookService = {
  getBooks: (params) => api.get('/books', { params }), // params: { categoryIds, authorId, keyword, page, size }
  getBookDetail: (id) => api.get(`/books/${id}`),
  createBook: (formData) => api.post('/books', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateBook: (id, formData) => api.put(`/books/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteBook: (id) => api.delete(`/books/${id}`),
  increaseViewCount: (bookId) => api.post(`/books/${bookId}/view`),
  getBooksByUserId: (userId) => api.get(`/users/${userId}/books`),
  getAllRatings: (page = 0, size = 100) => api.get(`/ratings?page=${page}&size=${size}`),
  
  // Admin Books
  getPendingBooks: (page = 0, size = 10) => api.get(`/books/pending?page=${page}&size=${size}`),
  getRejectedBooks: (page = 0, size = 10) => api.get(`/books/rejecting?page=${page}&size=${size}`),
  approveBook: (id) => api.put(`/books/${id}/approve`),
  rejectBook: (id) => api.put(`/books/${id}/reject`),

  // Chapters
  getChapters: (bookId, page = 0, size = 20) => api.get(`/books/${bookId}/chapters?page=${page}&size=${size}`),
  getChapterByBookId: (bookId) => api.get(`/books/${bookId}/chapters`),
  createChapter: (bookId, formData) => api.post(`/books/${bookId}/chapters`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  
  // Ratings & Bookshelf
  getRatingSummary: (bookId) => api.get(`/books/${bookId}/ratings/summary`),
  getRatings: (bookId) => api.get(`/books/${bookId}/ratings`),
  getRatingMyself: (bookId) => api.get(`/books/${bookId}/ratings/myself`),
  addRating: (bookId, data) => api.post(`/books/${bookId}/ratings`, data),
  updateBookshelfFavorite: (bookId) => api.put(`/books/${bookId}/bookshelfs/favorite`),
  
  //rating controller
  updateRating: (ratingId, data) => api.put(`/ratings/${ratingId}`, data),
  deleteRating: (ratingId) => api.delete(`/ratings/${ratingId}`),
  addToBookshelf: (bookId) => api.post(`/books/${bookId}/bookshelfs`),
  removeFromBookshelf: (bookId) => api.delete(`/books/${bookId}/bookshelfs`),
  updateReadingProgress: (bookId, chapterId) => api.put(`/books/${bookId}/bookshelfs/progress`, { chapterId }),
  chatBook: (bookId, data) => api.post(`/books/${bookId}/chat`, data),
  getBookChatHistory: (bookId, page = 0, size = 2) =>
    api.get(`/books/${bookId}/chat/history?page=${page}&size=${size}`),
  deleteBookChatHistory: (bookId) => api.delete(`/books/${bookId}/chat/history`),
};

export const chapterService = {
  getDetail: (chapterId) => api.get(`/chapters/${chapterId}`),
  updateChapter: (chapterId, data) => {
    if (data instanceof FormData) {
      return api.put(`/chapters/${chapterId}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.put(`/chapters/${chapterId}`, data);
  },
  deleteChapter: (chapterId) => api.delete(`/chapters/${chapterId}`),
  summarize: (chapterId) => api.post(`/chapters/${chapterId}/summary`),
  getComments: (chapterId, page = 0, size = 10) => api.get(`/chapters/${chapterId}/comments?page=${page}&size=${size}`),
  addComment: (chapterId, data) => api.post(`/chapters/${chapterId}/comments`, data),
  startQuiz: (chapterId) => api.post(`/chapters/${chapterId}/quizzes/start`),
  generateQuiz: (chapterId) => api.post(`/chapters/${chapterId}/quizzes`),
  chatChapter: (chapterId, data) => api.post(`/chapters/${chapterId}/chat`, data),
  getChatHistory: (chapterId, page = 0, size = 2) =>
    api.get(`/chapters/${chapterId}/chat/history?page=${page}&size=${size}`),
  deleteChatHistory: (chapterId) => api.delete(`/chapters/${chapterId}/chat/history`),
};

// ==================== COMMENTS & QUIZZES ====================
export const commentService = {
  replyComment: (commentId, data) => api.post(`/comments/${commentId}/replies`, data),
  updateComment: (commentId, data) => api.put(`/comments/${commentId}`, data),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
  getAllComments: (page = 0, size = 100) => api.get(`/comments?page=${page}&size=${size}`),
};

export const quizService = {
  submitQuiz: (quizId, userAnswerRequests) => api.post(`/quizzes/${quizId}/attempts`, { userAnswerRequests }),
  getQuiz: (quizId) => api.get(`/quizzes/${quizId}`),
  getAttemptDetail: (attemptId) => api.get(`/quiz-attempts/${attemptId}`),
  
};