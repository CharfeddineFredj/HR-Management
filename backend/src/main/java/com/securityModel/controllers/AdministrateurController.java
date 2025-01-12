package com.securityModel.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.securityModel.models.Administrateur;
import com.securityModel.payload.request.UpdateAdministrateurRequest;
import com.securityModel.payload.response.MessageResponse;
import com.securityModel.repository.RoleRepository;
import com.securityModel.repository.UserRepository;
import com.securityModel.security.jwt.JwtUtils;
import com.securityModel.security.services.RefreshTokenService;
import com.securityModel.service.AdminService;
import com.securityModel.utils.EmailService;
import com.securityModel.utils.StorgeService;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/administrateur")
public class AdministrateurController {
    @Autowired
    private AdminService adminService;
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    RefreshTokenService refreshTokenService;

    @Autowired
    EmailService emailService;
    @Autowired
    JavaMailSender javaMailSender;
    @Autowired
    private StorgeService storgeService;

    @GetMapping("/all")
    public List<Administrateur> ListAdministrateur(){
        return adminService.getall();
    }
    @PostMapping("/save")
    public Administrateur saveAdministrateur(@RequestBody Administrateur a){
        return adminService.create(a);
    }
    @GetMapping("getone/{id}")
    public Administrateur getone(@PathVariable Long id){
        return adminService.getbyId(id);
    }


    @PutMapping("/updateAdmin/{id}")
    public ResponseEntity<?> updateAdministrateur(@ModelAttribute UpdateAdministrateurRequest updateRequest,
                                                  @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            // Check if the administrator exists
            if (!adminService.existsById(updateRequest.getId())) {
                return ResponseEntity.badRequest().body("Error: Administrator not found!");
            }

            // Retrieve the existing administrator from the database
            Administrateur existingAdmin = adminService.getbyId(updateRequest.getId());

            // Handle file upload
            if (file != null && !file.isEmpty()) {
                String fileName = storgeService.store(file,true);
                existingAdmin.setImage(fileName);
            } else {
                // Log a warning if the file is not present or empty
                System.out.println("Warning: No file provided or file is empty.");
            }

            // Update administrator data
            updateAdminData(existingAdmin, updateRequest);
            adminService.update(existingAdmin);

            return ResponseEntity.ok(new MessageResponse("Administrator updated successfully!"));
        } catch (Exception e) {
            // Log the exception for debugging purposes
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    private void updateAdminData(Administrateur existingAdmin, UpdateAdministrateurRequest updateRequest) {
        existingAdmin.setEmail(updateRequest.getEmail());
        existingAdmin.setFirstname(updateRequest.getFirstname());
        existingAdmin.setLastname(updateRequest.getLastname());
        existingAdmin.setAddress(updateRequest.getAddress());
        existingAdmin.setDate_birth(updateRequest.getDate_birth());
        existingAdmin.setHire_date(updateRequest.getHire_date());
        existingAdmin.setSalary(updateRequest.getSalary());
        existingAdmin.setId_card(updateRequest.getId_card());
        existingAdmin.setPhone(updateRequest.getPhone());
        existingAdmin.setJob(updateRequest.getJob());
        existingAdmin.setDepartment(updateRequest.getDepartment());


    }




    @DeleteMapping("delet/{id}")
    public HashMap<String,String> deleteAdministrateur(@PathVariable Long id) {

        HashMap message = new HashMap();
        try {
            adminService.delete(id);
            message.put("etat", "admistrateur delet");
            return message;
        } catch (Exception e) {
            message.put("etat", "Error");
            return message;
        }
    }


    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> loadfile(@PathVariable String filename ) {
        Resource res = storgeService.loadFile(filename,true);
        HttpHeaders httpHeaders = new HttpHeaders();
        Map<String, String> extensionToContentType = new HashMap<>();
        extensionToContentType.put("pdf", "application/pdf");
        extensionToContentType.put("jpg", "image/jpeg");
        extensionToContentType.put("jpeg", "image/jpeg");
        extensionToContentType.put("png", "image/png");
// Obtenez l'extension du fichier à partir du nom de fichier
        String fileExtension = FilenameUtils.getExtension(filename);
// Obtenez le type de contenu à partir de la correspondance
        String contentType = extensionToContentType.getOrDefault(fileExtension.toLowerCase(),
                MediaType.APPLICATION_OCTET_STREAM_VALUE);
// Définissez le type de contenu dans les en-têtes de réponse
        httpHeaders.setContentType(MediaType.parseMediaType(contentType));
        return ResponseEntity.ok().headers(httpHeaders).body(res);
    }












}
