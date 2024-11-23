package com.example.library_management.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.library_management.dto.BorrowingDetailsDTO;
import com.example.library_management.entity.Book;
import com.example.library_management.entity.Borrowing;
import com.example.library_management.entity.Inventory;
import com.example.library_management.entity.Reader;
import com.example.library_management.enums.BorrowingStatus;
import com.example.library_management.exception.ResourceNotFoundException;
import com.example.library_management.repository.BookRepository;
import com.example.library_management.repository.BorrowingRepository;
import com.example.library_management.repository.ReaderRepository;

@Service
public class BorrowingService {
    
    private final BorrowingRepository borrowingRepository;
    private final ReaderRepository readerRepository;
    private final BookRepository bookRepository;

    public BorrowingService(BorrowingRepository borrowingRepository,
                            ReaderRepository readerRepository,
                            BookRepository bookRepository){
        this.borrowingRepository = borrowingRepository;
        this.readerRepository = readerRepository;
        this.bookRepository = bookRepository;
    }

    // Chuyển đổi Borrowing thành BorrowingDetailsDTO
    private BorrowingDetailsDTO toBorrowingDetailsDTO(Borrowing borrowing) {
        BorrowingDetailsDTO dto = new BorrowingDetailsDTO();
        dto.setId(borrowing.getId());
        dto.setIdReader(borrowing.getReader().getId());
        dto.setBookTitle(borrowing.getBook().getTitle());
        dto.setBookImageUrl(borrowing.getBook().getFile()); // Sử dụng link_file làm imageUrl
        dto.setBorrowDate(borrowing.getBorrowDate());
        dto.setReturnDate(borrowing.getReturnDate());
        dto.setStatus(borrowing.getStatus().name());
        return dto;
    }

    // Lấy tất cả các lần mượn với chi tiết
    public List<BorrowingDetailsDTO> getAllBorrowingDetails(){
        List<Borrowing> borrowings = borrowingRepository.findAll();
        return borrowings.stream()
                .map(this::toBorrowingDetailsDTO)
                .collect(Collectors.toList());
    }

    // Lấy lần mượn theo ID
    public Borrowing getBorrowingById(Long id){
        return borrowingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Borrowing not found with id " + id));
    }

    // Tạo lần mượn mới
    @Transactional
    public Borrowing createBorrowing(Long readerId, Long bookId, LocalDate borrowDate, LocalDate returnDate){
        Reader reader = readerRepository.findById(readerId)
                .orElseThrow(() -> new ResourceNotFoundException("Reader not found with id " + readerId));
        
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + bookId));
        
        // Kiểm tra số lượng sách có sẵn nhưng không giảm số lượng
        Inventory inventory = book.getInventory();
        if(inventory.getAvailableStock() <= 0){
            throw new IllegalStateException("No available stock for book id " + bookId);
        }
        
        // Tạo Borrowing với trạng thái DANG_CHO_DUYET
        Borrowing borrowing = new Borrowing();
        borrowing.setReader(reader);
        borrowing.setBook(book);
        borrowing.setBorrowDate(borrowDate);
        borrowing.setReturnDate(returnDate);
        borrowing.setStatus(BorrowingStatus.DANG_CHO_DUYET); // Trạng thái mặc định
        
        return borrowingRepository.save(borrowing);
    }

    // Duyệt đơn mượn
    @Transactional
    public Borrowing approveBorrowing(Long borrowingId) {
        Borrowing borrowing = borrowingRepository.findById(borrowingId)
                .orElseThrow(() -> new ResourceNotFoundException("Borrowing not found with id " + borrowingId));

        // Chỉ xử lý nếu trạng thái là DANG_CHO_DUYET
        if (borrowing.getStatus() != BorrowingStatus.DANG_CHO_DUYET) {
            throw new IllegalStateException("Borrowing is not in DANG_CHO_DUYET state");
        }

        // Giảm số lượng sách
        Inventory inventory = borrowing.getBook().getInventory();
        if (inventory.getAvailableStock() <= 0) {
            throw new IllegalStateException("No available stock for book id " + borrowing.getBook().getId());
        }

        inventory.setAvailableStock(inventory.getAvailableStock() - 1);
        borrowing.getBook().setInventory(inventory);

        // Cập nhật trạng thái và ngày mượn
        borrowing.setStatus(BorrowingStatus.DANG_MUON);
        borrowing.setBorrowDate(LocalDate.now()); // Set ngày hiện tại làm ngày mượn

        return borrowingRepository.save(borrowing);
    }

    // Cập nhật lần mượn (ví dụ: trả sách)
    @Transactional
    public Borrowing returnBook(Long borrowingId, LocalDate actualReturnDate){
        Borrowing borrowing = borrowingRepository.findById(borrowingId)
                .orElseThrow(() -> new ResourceNotFoundException("Borrowing not found with id " + borrowingId));
        
        if(borrowing.getStatus() == BorrowingStatus.DA_TRA){
            throw new IllegalStateException("Book already returned");
        }
        
        borrowing.setActualReturnDate(actualReturnDate);
        borrowing.setStatus(BorrowingStatus.DA_TRA);
        
        // Tăng số lượng sách có sẵn
        Inventory inventory = borrowing.getBook().getInventory();
        inventory.setAvailableStock(inventory.getAvailableStock() + 1);
        
        return borrowingRepository.save(borrowing);
    }

    // Xóa lần mượn
    public void deleteBorrowing(Long id){
        borrowingRepository.deleteById(id);
    }


    public List<Borrowing> getBorrowingsByWeek(int year, int week) {
        LocalDate startDate = LocalDate.ofYearDay(year, 1).with(WeekFields.ISO.weekOfYear(), week).with(DayOfWeek.MONDAY);
        LocalDate endDate = startDate.plusDays(6);

        return borrowingRepository.findByBorrowDateBetween(startDate, endDate);
    }

    public List<Borrowing> getBorrowingsByMonth(int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        return borrowingRepository.findByBorrowDateBetween(startDate, endDate);
    }

    public List<Borrowing> getBorrowingsByYear(int year) {
        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = startDate.withDayOfYear(startDate.lengthOfYear());

        return borrowingRepository.findByBorrowDateBetween(startDate, endDate);
    }
        // Lấy đơn mượn theo ID người đọc với chi tiết
    public List<BorrowingDetailsDTO> getBorrowingByReaderId(Long readerId) {
        List<Borrowing> borrowings = borrowingRepository.findByReaderId(readerId);
        return borrowings.stream()
                .map(this::toBorrowingDetailsDTO)
                .collect(Collectors.toList());
    }

    public long countBorrowingsByStatus(List<Borrowing> borrowings, BorrowingStatus status) {
        return borrowings.stream().filter(borrowing -> borrowing.getStatus() == status).count();
    }

    // Lấy đơn mượn theo người đọc với chi tiết
    public List<BorrowingDetailsDTO> getBorrowingDetailsByReaderId(Long readerId) {
        List<Borrowing> borrowings = borrowingRepository.findByReaderId(readerId);
        return borrowings.stream()
                .map(this::toBorrowingDetailsDTO)
                .collect(Collectors.toList());
    }

    // Lấy sách đang mượn với chi tiết
    public List<BorrowingDetailsDTO> getBorrowedBooksDetails() {
        List<Borrowing> borrowings = borrowingRepository.findByStatus(BorrowingStatus.DANG_MUON);
        return borrowings.stream()
                .map(this::toBorrowingDetailsDTO)
                .collect(Collectors.toList());
    }
    public List<BorrowingDetailsDTO> getAllBorrowings(){
        List<Borrowing> borrowings = borrowingRepository.findAll();
        return borrowings.stream()
                .map(this::toBorrowingDetailsDTO)
                .collect(Collectors.toList());
    }
    // Lấy các sách đang mượn với chi tiết
    public List<BorrowingDetailsDTO> getBorrowedBooks() {
        List<Borrowing> borrowings = borrowingRepository.findByStatus(BorrowingStatus.DANG_MUON);
        return borrowings.stream()
                .map(this::toBorrowingDetailsDTO)
                .collect(Collectors.toList());
    }
}
