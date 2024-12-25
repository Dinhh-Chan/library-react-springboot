// src/main/java/com/example/library_management/dto/BorrowingStatusCountsResponse.java
package com.example.library_management.dto;

public class BorrowingStatusCountsResponse {
    private Long dangChoDuyet;
    private Long dangMuon;
    private Long daTra;
    private Long quaHan;

    // Constructors
    public BorrowingStatusCountsResponse() {}

    public BorrowingStatusCountsResponse(Long dangChoDuyet, Long dangMuon, Long daTra, Long quaHan) {
        this.dangChoDuyet = dangChoDuyet;
        this.dangMuon = dangMuon;
        this.daTra = daTra;
        this.quaHan = quaHan;
    }

    // Getters and Setters
    public Long getDangChoDuyet() {
        return dangChoDuyet;
    }

    public void setDangChoDuyet(Long dangChoDuyet) {
        this.dangChoDuyet = dangChoDuyet;
    }

    public Long getDangMuon() {
        return dangMuon;
    }

    public void setDangMuon(Long dangMuon) {
        this.dangMuon = dangMuon;
    }

    public Long getDaTra() {
        return daTra;
    }

    public void setDaTra(Long daTra) {
        this.daTra = daTra;
    }

    public Long getQuaHan() {
        return quaHan;
    }

    public void setQuaHan(Long quaHan) {
        this.quaHan = quaHan;
    }
}
