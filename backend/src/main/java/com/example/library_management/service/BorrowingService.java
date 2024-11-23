package com.example.library_management.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.library_management.entity.Book;
import com.example.library_management.entity.Borrowing;
import com.example.library_management.entity.Inventory;
import com.example.library_management.entity.Reader;
import com.example.library_management.enums.BorrowingStatus;
import com.example.library_management.exception.ResourceNotFoundException;
import com.example.library_management.repository.BorrowingRepository;

@Service
@Transactional
public class BorrowingService {

    private final BorrowingRepository borrowingRepository;
    private final ReaderService readerService;
    private final BookService bookService;
    private final InventoryService inventoryService;

    public BorrowingService(BorrowingRepository borrowingRepository, ReaderService readerService,
            BookService bookService, InventoryService inventoryService) {
        this.borrowingRepository = borrowingRepository;
        this.readerService = readerService;
        this.bookService = bookService;
        this.inventoryService = inventoryService;
    }

    // Tạo một borrowing mới
    public Borrowing createBorrowing(Borrowing borrowing) {
        return borrowingRepository.save(borrowing);
    }

    // Lấy tất cả các borrowings
    public List<Borrowing> getAllBorrowings() {
        return borrowingRepository.findAll();
    }

    // Lấy một borrowing theo ID
    public Optional<Borrowing> getBorrowingById(Long id) {
        return borrowingRepository.findById(id);
    }

    // Cập nhật một borrowing
    public Borrowing updateBorrowing(Long id, Borrowing borrowingDetails) {
        Borrowing borrowing = borrowingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Borrowing not found with id " + id));

        borrowing.setReader(borrowingDetails.getReader());
        borrowing.setBook(borrowingDetails.getBook());
        borrowing.setBorrowDate(borrowingDetails.getBorrowDate());
        borrowing.setReturnDate(borrowingDetails.getReturnDate());
        borrowing.setActualReturnDate(borrowingDetails.getActualReturnDate());
        borrowing.setStatus(borrowingDetails.getStatus());

        return borrowingRepository.save(borrowing);
    }

    // Xóa một borrowing
    public void deleteBorrowing(Long id) {
        Borrowing borrowing = borrowingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Borrowing not found with id " + id));
        borrowingRepository.delete(borrowing);
    }

    // Phương thức duyệt đơn mượn
    public Borrowing approveBorrowing(Long id) {
        Borrowing borrowing = borrowingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Borrowing not found with id " + id));

        if (borrowing.getStatus() != BorrowingStatus.DANG_CHO_DUYET) {
            throw new IllegalStateException("Only borrowings with status DANG_CHO_DUYET can be approved.");
        }

        Book book = borrowing.getBook();
        Inventory inventory = inventoryService.getInventoryByBook(book);

        if (inventory.getAvailableStock() <= 0) {
            throw new IllegalStateException("No available stock for book id " + book.getId());
        }

        // Giảm availableStock đi 1
        inventory.setAvailableStock(inventory.getAvailableStock() - 1);
        inventoryService.saveInventory(inventory);

        // Cập nhật trạng thái
        borrowing.setStatus(BorrowingStatus.DANG_MUON);

        // Cập nhật ngày mượn là ngày hiện tại
        LocalDate today = LocalDate.now();
        borrowing.setBorrowDate(today);

        // Cập nhật ngày trả dự kiến là 14 ngày sau
        borrowing.setReturnDate(today.plusDays(14));

        // Lưu thay đổi
        return borrowingRepository.save(borrowing);
    }

    // Phương thức trả sách
    public Borrowing returnBorrowing(Long id, LocalDate actualReturnDate) {
        Borrowing borrowing = borrowingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Borrowing not found with id " + id));

        if (borrowing.getStatus() != BorrowingStatus.DANG_MUON && borrowing.getStatus() != BorrowingStatus.QUA_HAN) {
            throw new IllegalStateException("Only borrowings with status DANG_MUON or QUA_HAN can be returned.");
        }

        // Cập nhật trạng thái
        borrowing.setStatus(BorrowingStatus.DA_TRA);

        // Cập nhật ngày trả thực tế
        borrowing.setActualReturnDate(actualReturnDate != null ? actualReturnDate : LocalDate.now());

        // Tăng availableStock lên 1
        Book book = borrowing.getBook();
        Inventory inventory = inventoryService.getInventoryByBook(book);
        inventory.setAvailableStock(inventory.getAvailableStock() + 1);
        inventoryService.saveInventory(inventory);

        // Lưu thay đổi
        return borrowingRepository.save(borrowing);
    }
}
