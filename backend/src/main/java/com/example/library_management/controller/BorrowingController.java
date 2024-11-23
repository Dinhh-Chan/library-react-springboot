package com.example.library_management.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.library_management.dto.BorrowingDetailsDTO;
import com.example.library_management.dto.BorrowingRequest;
import com.example.library_management.entity.Borrowing;
import com.example.library_management.enums.BorrowingStatus;
import com.example.library_management.exception.ResourceNotFoundException;
import com.example.library_management.service.BorrowingService;
@RestController
@RequestMapping("/api/borrowings")
public class BorrowingController {
    
    private final BorrowingService borrowingService;

    public BorrowingController(BorrowingService borrowingService){
        this.borrowingService = borrowingService;
    }

    // Lấy tất cả các lần mượn
    @GetMapping
    public ResponseEntity<List<BorrowingDetailsDTO>> getAllBorrowings() {
        List<BorrowingDetailsDTO> borrowings = borrowingService.getAllBorrowings();
        return ResponseEntity.ok(borrowings);
    }
    // Lấy lần mượn theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Borrowing> getBorrowingById(@PathVariable Long id){
        try {
            Borrowing borrowing = borrowingService.getBorrowingById(id);
            return ResponseEntity.ok(borrowing);
        } catch (ResourceNotFoundException ex){
            return ResponseEntity.notFound().build();
        }
    }

    // Tạo lần mượn mới
    @PostMapping
    public ResponseEntity<Borrowing> createBorrowing(@RequestBody BorrowingRequest borrowingRequest){
        Borrowing createdBorrowing = borrowingService.createBorrowing(
                borrowingRequest.getReaderId(),
                borrowingRequest.getBookId(),
                borrowingRequest.getBorrowDate(),
                borrowingRequest.getReturnDate()
        );
        return ResponseEntity.status(201).body(createdBorrowing);
    }

    // Trả sách (cập nhật lần mượn)
    @PutMapping("/return/{id}")
    public ResponseEntity<Borrowing> returnBook(@PathVariable Long id, @RequestParam(required = false) String actualReturnDate){
        try {
            Borrowing updatedBorrowing = borrowingService.returnBook(id, 
                    actualReturnDate != null ? LocalDate.parse(actualReturnDate) : LocalDate.now());
            return ResponseEntity.ok(updatedBorrowing);
        } catch (ResourceNotFoundException | IllegalStateException ex){
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Xóa lần mượn
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBorrowing(@PathVariable Long id){
        try {
            borrowingService.deleteBorrowing(id);
            return ResponseEntity.noContent().build();
        } catch (Exception ex){
            return ResponseEntity.notFound().build();
        }
    }
        @GetMapping("/weekly")
    public ResponseEntity<Map<String, Long>> getWeeklyBorrowings(
            @RequestParam int year,
            @RequestParam int week) {
        List<Borrowing> borrowings = borrowingService.getBorrowingsByWeek(year, week);

        Map<String, Long> summary = generateSummary(borrowings);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/monthly")
    public ResponseEntity<Map<String, Long>> getMonthlyBorrowings(
            @RequestParam int year,
            @RequestParam int month) {
        List<Borrowing> borrowings = borrowingService.getBorrowingsByMonth(year, month);

        Map<String, Long> summary = generateSummary(borrowings);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/yearly")
    public ResponseEntity<Map<String, Long>> getYearlyBorrowings(
            @RequestParam int year) {
        List<Borrowing> borrowings = borrowingService.getBorrowingsByYear(year);

        Map<String, Long> summary = generateSummary(borrowings);
        return ResponseEntity.ok(summary);
    }

    private Map<String, Long> generateSummary(List<Borrowing> borrowings) {
        Map<String, Long> summary = new HashMap<>();
        summary.put("borrowing", borrowingService.countBorrowingsByStatus(borrowings, BorrowingStatus.DANG_MUON));
        summary.put("returned", borrowingService.countBorrowingsByStatus(borrowings, BorrowingStatus.DA_TRA));
        summary.put("overdue", borrowingService.countBorrowingsByStatus(borrowings, BorrowingStatus.QUA_HAN));
        return summary;
    }

    @GetMapping("/history/{readerId}")
    public ResponseEntity<List<BorrowingDetailsDTO>> getBorrowingByReaderId(@PathVariable Long readerId) {
        List<BorrowingDetailsDTO> borrowings = borrowingService.getBorrowingByReaderId(readerId);
        return ResponseEntity.ok(borrowings);
    }

    @GetMapping("/borrowed-books")
    public ResponseEntity<List<BorrowingDetailsDTO>> getBorrowedBooks() {
        List<BorrowingDetailsDTO> borrowings = borrowingService.getBorrowedBooks();
        return ResponseEntity.ok(borrowings);
    }
}
