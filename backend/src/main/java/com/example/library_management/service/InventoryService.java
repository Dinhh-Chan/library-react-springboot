package com.example.library_management.service;

import com.example.library_management.entity.Inventory;
import com.example.library_management.exception.ResourceNotFoundException;
import com.example.library_management.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {
    
    private final InventoryRepository inventoryRepository;

    public InventoryService(InventoryRepository inventoryRepository){
        this.inventoryRepository = inventoryRepository;
    }

    // Lấy tất cả Inventory
    public List<Inventory> getAllInventories(){
        return inventoryRepository.findAll();
    }

    // Lấy Inventory theo ID
    public Optional<Inventory> getInventoryById(Long id){
        return inventoryRepository.findById(id);
    }

    // Tạo Inventory mới
    public Inventory createInventory(Inventory inventory){
        return inventoryRepository.save(inventory);
    }

    // Cập nhật Inventory
    public Inventory updateInventory(Long id, Inventory inventoryDetails){
        return inventoryRepository.findById(id).map(inventory -> {
            inventory.setTotalStock(inventoryDetails.getTotalStock());
            inventory.setAvailableStock(inventoryDetails.getAvailableStock());
            // Cập nhật các thuộc tính khác nếu cần
            return inventoryRepository.save(inventory);
        }).orElseThrow(() -> new ResourceNotFoundException("Inventory not found with id " + id));
    }

    // Xóa Inventory
    public void deleteInventory(Long id){
        inventoryRepository.deleteById(id);
    }

    // Thêm các phương thức nghiệp vụ khác nếu cần
}
