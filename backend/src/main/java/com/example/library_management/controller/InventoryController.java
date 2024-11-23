package com.example.library_management.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.library_management.entity.Inventory;
import com.example.library_management.exception.ResourceNotFoundException;
import com.example.library_management.service.InventoryService;

@RestController
@RequestMapping("/api/inventories")
public class InventoryController {
    
    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService){
        this.inventoryService = inventoryService;
    }

    // Lấy tất cả Inventory
    @GetMapping
    public List<Inventory> getAllInventories(){
        return inventoryService.getAllInventories();
    }

    // Lấy Inventory theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getInventoryById(@PathVariable Long id){
        return inventoryService.getInventoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Tạo Inventory mới
    @PostMapping
    public ResponseEntity<Inventory> createInventory(@RequestBody Inventory inventory){
        Inventory createdInventory = inventoryService.createInventory(inventory);
        return ResponseEntity.status(201).body(createdInventory);
    }

    // Cập nhật Inventory
    @PutMapping("/{id}")
    public ResponseEntity<Inventory> updateInventory(@PathVariable Long id, @RequestBody Inventory inventory){
        try {
            Inventory updatedInventory = inventoryService.updateInventory(id, inventory);
            return ResponseEntity.ok(updatedInventory);
        } catch (ResourceNotFoundException ex){
            return ResponseEntity.notFound().build();
        }
    }

    // Xóa Inventory
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id){
        try {
            inventoryService.deleteInventory(id);
            return ResponseEntity.noContent().build();
        } catch (Exception ex){
            return ResponseEntity.notFound().build();
        }
    }
}
