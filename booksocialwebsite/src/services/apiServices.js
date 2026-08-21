import api from './api';

// ==================== AUTH & USER ====================
export const authService = {
  login: (data) => api.post('/auth/login', data), // LoginRequest
  register: (data) => api.post('/auth/register', data), // RegisterRequest
  googleLogin: (idToken) => api.post('/auth/google', { idToken }), // GoogleLoginRequest
  logout: () => api.post('/auth/logout'),
  getMyInfo: () => api.get('/users/my-info'),
  updateMyInfo: (formData) => api.put('/users/my-info', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  changePassword: (data) => api.put('/users/change-password', data),
  getMyBooks: (page = 0, size = 10) => api.get(`/users/books?page=${page}&size=${size}`),
  getMyBookshelf: () => api.get('/users/bookshelfs'),
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
  
  // Admin Books
  getPendingBooks: (page = 0, size = 10) => api.get(`/books/pending?page=${page}&size=${size}`),
  approveBook: (id) => api.put(`/books/${id}/approve`),
  rejectBook: (id) => api.put(`/books/${id}/reject`),

  // Chapters
  getChapters: (bookId, page = 0, size = 20) => api.get(`/books/${bookId}/chapters?page=${page}&size=${size}`),
  createChapter: (bookId, formData) => api.post(`/books/${bookId}/chapters`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  
  // Ratings & Bookshelf
  getRatingSummary: (bookId) => api.get(`/books/${bookId}/ratings/summary`),
  getRatings: (bookId) => api.get(`/books/${bookId}/ratings`),
  getRatingMyself: (bookId) => api.get(`/books/${bookId}/ratings/myself`),
  addRating: (bookId, data) => api.post(`/books/${bookId}/ratings`, data),
  updateRating: (ratingId, data) => api.put(`/ratings/${ratingId}`, data),
  deleteRating: (ratingId) => api.delete(`/ratings/${ratingId}`),
  addToBookshelf: (bookId) => api.post(`/books/${bookId}/bookshelfs`),
  removeFromBookshelf: (bookId) => api.delete(`/books/${bookId}/bookshelfs`),
  updateReadingProgress: (bookId, chapterId) => api.put(`/books/${bookId}/bookshelfs/progress`, { chapterId }),
};

export const chapterService = {
  getDetail: (chapterId) => api.get(`/chapters/${chapterId}`),
  summarize: (chapterId) => api.post(`/chapters/${chapterId}/summary`),
  getComments: (chapterId) => api.get(`/chapters/${chapterId}/comments`),
  addComment: (chapterId, data) => api.post(`/chapters/${chapterId}/comments`, data),
  generateQuiz: (chapterId) => api.post(`/chapters/${chapterId}/quizzes`),
};

// ==================== COMMENTS & QUIZZES ====================
export const commentService = {
  replyComment: (commentId, data) => api.post(`/comments/${commentId}/replies`, data),
  updateComment: (commentId, data) => api.put(`/comments/${commentId}`, data),
  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),
};

export const quizService = {
  submitQuiz: (quizId, userAnswerRequests) => api.post(`/quizzes/${quizId}/attempts`, { userAnswerRequests }),
  getAttemptDetail: (attemptId) => api.get(`/quiz-attempts/${attemptId}`),
};