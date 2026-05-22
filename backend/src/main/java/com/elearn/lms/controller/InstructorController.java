package com.elearn.lms.controller;

import com.elearn.lms.dto.InstructorSignupRequest;
import com.elearn.lms.dto.InstructorUpdateRequest;
import com.elearn.lms.entity.Instructor;
import com.elearn.lms.service.InstructorService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/instructors")
@CrossOrigin(origins = "*")
public class InstructorController {

    private static final Logger logger = LoggerFactory.getLogger(InstructorController.class);
    private final InstructorService instructorService;

    public InstructorController(InstructorService instructorService) {
        this.instructorService = instructorService;
    }

    @GetMapping
    public List<Instructor> list() { 
        logger.info("Fetching all instructors");
        return instructorService.findAll(); 
    }

    @GetMapping("/{id}")
    public Instructor get(@PathVariable Long id) { 
        logger.info("Fetching instructor with ID: {}", id);
        return instructorService.findByIdOrThrow(id); 
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody InstructorSignupRequest request) {
        logger.info("Creating instructor with email: {}", request.getEmail());
        logger.debug("Create request - bio: '{}', expertise: '{}'", request.getBio(), request.getExpertise());
        try {
            Instructor i = instructorService.create(request);
            logger.info("Instructor created successfully with ID: {}", i.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(i);
        } catch (IllegalArgumentException ex) {
            logger.error("Create failed: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", ex.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody InstructorUpdateRequest request) {
        logger.info("Updating instructor with ID: {}", id);
        try {
            Instructor updated = instructorService.update(id, request);
            logger.info("Instructor updated successfully with ID: {}", id);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            logger.error("Update failed for instructor ID {}: {}", id, ex.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", ex.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        logger.info("Deleting instructor with ID: {}", id);
        try {
            instructorService.delete(id);
            logger.info("Instructor deleted successfully with ID: {}", id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException ex) {
            logger.error("Delete failed: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", ex.getMessage()));
        }
    }

    // Password change endpoint removed
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        logger.error("Validation failed: {}", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Validation failed", "errors", errors));
    }
}

