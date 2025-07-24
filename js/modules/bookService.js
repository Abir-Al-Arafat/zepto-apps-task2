export class BookService {
    constructor() {
        this.baseUrl = 'https://gutendex.com/books';
        this.books = [];
        this.filteredBooks = [];
        this.genres = new Set();
        this.searchTerm = '';
        this.genreFilter = '';
        this.currentPage = 1;
        this.booksPerPage = 12;
        this.pagination = {
            currentPage: 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
        };
    }

    async fetchBooks() {
        try {
            const response = await fetch(`${this.baseUrl}?page=${this.currentPage}`);
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            const data = await response.json();
            this.books = data.results.map(book => this._formatBook(book));
            this._extractGenres();
            this._filterBooks();
            this._updatePagination(data);
            return this.books;
        } catch (error) {
            console.error('Error fetching books:', error);
            throw error;
        }
    }

    async getBookById(id) {
        try {
            // First check if the book is already in our list
            const existingBook = this.books.find(book => book.id === parseInt(id));
            if (existingBook) return existingBook;

            // If not, fetch it from the API
            const response = await fetch(`${this.baseUrl}/${id}`);
            if (!response.ok) {
                throw new Error('Book not found');
            }
            const data = await response.json();
            return this._formatBook(data);
        } catch (error) {
            console.error('Error fetching book details:', error);
            throw error;
        }
    }

    setSearchTerm(term) {
        this.searchTerm = term.toLowerCase().trim();
        this.currentPage = 1;
        this._filterBooks();
    }

    setGenreFilter(genre) {
        this.genreFilter = genre;
        this.currentPage = 1;
        this._filterBooks();
    }

    nextPage() {
        if (this.pagination.hasNext) {
            this.currentPage++;
            return this.fetchBooks();
        }
        return Promise.resolve(this.books);
    }

    previousPage() {
        if (this.pagination.hasPrev) {
            this.currentPage--;
            return this.fetchBooks();
        }
        return Promise.resolve(this.books);
    }

    _formatBook(book) {
        return {
            id: book.id,
            title: book.title,
            author: book.authors?.[0]?.name || 'Unknown Author',
            coverUrl: book.formats?.['image/jpeg'] || book.formats?.['image/png'] || '',
            genres: book.subjects?.map(subject => 
                subject.split(' -- ')[0].toLowerCase()
            ) || [],
            downloadCount: book.download_count || 0,
            languages: book.languages || [],
            copyright: book.copyright || false,
            mediaType: book.media_type || 'text'
        };
    }

    _extractGenres() {
        this.books.forEach(book => {
            book.genres.forEach(genre => {
                if (genre && !genre.includes('--')) {
                    this.genres.add(genre);
                }
            });
        });
    }

    _filterBooks() {
        this.filteredBooks = this.books.filter(book => {
            const matchesSearch = !this.searchTerm || 
                book.title.toLowerCase().includes(this.searchTerm) ||
                book.author.toLowerCase().includes(this.searchTerm);
            
            const matchesGenre = !this.genreFilter || 
                book.genres.some(genre => genre === this.genreFilter.toLowerCase());
            
            return matchesSearch && matchesGenre;
        });
    }

    _updatePagination(data) {
        this.pagination = {
            currentPage: this.currentPage,
            totalPages: Math.ceil(data.count / this.booksPerPage),
            hasNext: !!data.next,
            hasPrev: !!data.previous
        };
    }
}
