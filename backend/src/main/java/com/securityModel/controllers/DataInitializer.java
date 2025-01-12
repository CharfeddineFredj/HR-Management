package com.securityModel.controllers;

import com.securityModel.models.Administrateur;
import com.securityModel.models.ERole;
import com.securityModel.models.Role;
import com.securityModel.models.User;
import com.securityModel.repository.RoleRepository;
import com.securityModel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Vérifiez d'abord si les rôles existent déjà
        if (roleRepository.count() == 0) {
            // Si les rôles n'existent pas, créez-les et enregistrez-les dans la base de données
            roleRepository.save(new Role(ERole.Administrateur));
            roleRepository.save(new Role(ERole.Responsable));
            roleRepository.save(new Role(ERole.Employee));
            roleRepository.save(new Role(ERole.Recruteur));
        }


        // Vérifiez si l'administrateur existe déjà
        if (userRepository.findByUsername("ADMINDIGID").isEmpty()) {
            // Si l'administrateur n'existe pas, créez un utilisateur administrateur et enregistrez-le dans la base de données
            Administrateur adminUser = new Administrateur("ADMINDIGID", "digid.tunis@gmail.com", passwordEncoder.encode("123456789"),"","Foulen","ben foulen","mahdia rue sadaka","administratif","2024-10-03","Administrateur","2024-12-05 11:00",1500,"12345678","51458368","male","CDI");
            adminUser.setConfirme(true);
            // Créez une liste de rôles et ajoutez le rôle administrateur à cette liste
            Set<Role> roles = new HashSet<>();
            Role adminRole = roleRepository.findByName(ERole.Administrateur)
                    .orElseThrow(() -> new RuntimeException("ERole not found"));
            roles.add(adminRole);
            adminUser.setRoles(roles);

            // Enregistrez l'utilisateur dans la base de données
            userRepository.save(adminUser);
        }


    }
}
