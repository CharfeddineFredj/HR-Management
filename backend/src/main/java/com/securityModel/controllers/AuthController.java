package com.securityModel.controllers;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.securityModel.models.ERole;
import com.securityModel.payload.request.LoginRequest;
import com.securityModel.payload.request.SignupRequest;
import com.securityModel.payload.request.TokenRefreshRequest;
import com.securityModel.payload.response.JwtResponse;
import com.securityModel.payload.response.MessageResponse;
import com.securityModel.payload.response.TokenRefreshResponse;
import com.securityModel.repository.RoleRepository;
import com.securityModel.repository.UserRepository;
import com.securityModel.security.jwt.JwtUtils;
import com.securityModel.security.services.RefreshTokenService;
import com.securityModel.security.services.UserDetailsImpl;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.securityModel.exception.TokenRefreshException;
import com.securityModel.models.RefreshToken;
import com.securityModel.models.Role;
import com.securityModel.models.User;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
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
  JavaMailSender javaMailSender;

//  @PostMapping("/signin")
//  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
//
//    Authentication authentication = authenticationManager
//        .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
//
//    SecurityContextHolder.getContext().setAuthentication(authentication);
//
//    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
//
//    String jwt = jwtUtils.generateJwtToken(userDetails);
//
//    List<String> roles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
//        .collect(Collectors.toList());
//
//    RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());
//
//    return ResponseEntity.ok(new JwtResponse(jwt, refreshToken.getToken(), userDetails.getId(),
//        userDetails.getUsername(), userDetails.getEmail(), roles));
//  }

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    // Validate the login request to ensure either username or email is provided
    if ((loginRequest.getUsername() == null || loginRequest.getUsername().isEmpty()) &&
            (loginRequest.getEmail() == null || loginRequest.getEmail().isEmpty())) {
      return ResponseEntity.badRequest().body("Username or email must be provided");
    }

    // Determine whether to use username or email for login
    String loginIdentifier = (loginRequest.getUsername() != null && !loginRequest.getUsername().isEmpty()) ?
            loginRequest.getUsername() : loginRequest.getEmail();

    try {
      // Attempt to authenticate using identifier (username or email) and password
      Authentication authentication = authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(loginIdentifier, loginRequest.getPassword())
      );

      // Find the user by the loginIdentifier (username or email)
      Optional<User> user = userRepository.findByUsernameOrEmail(loginIdentifier, loginIdentifier);

      if (user.isPresent()) {
        User currentUser = user.get();

        // Check if the user is confirmed and active
        if (!currentUser.isConfirme()) {
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not confirmed");
        }

        if (!currentUser.isStatus()) {
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User status is inactive");
        }

        // Authenticate the user and generate JWT tokens
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateJwtToken(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

        return ResponseEntity.ok(new JwtResponse(jwt, refreshToken.getToken(), userDetails.getId(),
                userDetails.getUsername(), userDetails.getEmail(), roles));
      } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
      }

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid login attempt");
    }
  }

  // In your UserRepository, add the following method



  // In your UserRepository, add the following method


  // In your UserRepository, add the following method








  /* @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(),
        encoder.encode(signUpRequest.getPassword()));

    Set<String> strRoles = signUpRequest.getRole();
    Set<Role> roles = new HashSet<>();

    if (strRoles == null) {
      Role userRole = roleRepository.findByName(ERole.ROLE_USER)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(userRole);
    } else {
      strRoles.forEach(role -> {
        switch (role) {
        case "PROVIDER":
          Role adminRole = roleRepository.findByName(ERole.ROLE_PROVIDER)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(adminRole);

          break;
        case "CUSTOMER":
          Role modRole = roleRepository.findByName(ERole.ROLE_CUSOTMER)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(modRole);

          break;
        default:
          Role userRole = roleRepository.findByName(ERole.ROLE_USER)
              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
          roles.add(userRole);
        }
      });
    }

    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }*/

  @PostMapping("/refreshtoken")
  public ResponseEntity<?> refreshtoken(@Valid @RequestBody TokenRefreshRequest request) {
    String requestRefreshToken = request.getRefreshToken();

    return refreshTokenService.findByToken(requestRefreshToken)
            .map(refreshTokenService::verifyExpiration)
            .map(RefreshToken::getUser)
            .map(user -> {
              String token = jwtUtils.generateTokenFromUsername(user.getUsername());
              return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
            })
            .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                    "Refresh token is not in database!"));
  }

  @PostMapping("/signout")
  public ResponseEntity<?> logoutUser() {
    UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    Long userId = userDetails.getId();
    refreshTokenService.deleteByUserId(userId);
    return ResponseEntity.ok(new MessageResponse("Log out successful!"));
  }

}
