package ma.maarifculture.analytics.config;

import ma.maarifculture.analytics.model.AppUser;
import ma.maarifculture.analytics.model.UserRole;
import ma.maarifculture.analytics.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class BootstrapAdminConfiguration implements ApplicationRunner {
    private final AppUserRepository users;
    private final PasswordEncoder encoder;
    private final String email;
    private final String password;
    private final String fullName;

    public BootstrapAdminConfiguration(AppUserRepository users, PasswordEncoder encoder,
            @Value("${maarif.bootstrap-admin.email:}") String email,
            @Value("${maarif.bootstrap-admin.password:}") String password,
            @Value("${maarif.bootstrap-admin.full-name:Administrateur Maarif}") String fullName) {
        this.users = users;
        this.encoder = encoder;
        this.email = email;
        this.password = password;
        this.fullName = fullName;
    }

    @Override @Transactional
    public void run(ApplicationArguments args) {
        if (email.isBlank() || password.isBlank() || users.existsByEmailIgnoreCase(email)) return;
        if (password.length() < 12 || password.length() > 128
                || !password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$")) {
            throw new IllegalStateException("BOOTSTRAP_ADMIN_PASSWORD doit contenir 12 à 128 caractères, une minuscule, une majuscule et un chiffre.");
        }
        users.save(new AppUser(fullName, email, encoder.encode(password), UserRole.ADMINISTRATOR));
    }
}
