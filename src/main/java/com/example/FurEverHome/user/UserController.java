package com.example.FurEverHome.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("api/v1/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/get")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public List<User> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/getbyemail/{email}")
    @PreAuthorize("#email == authentication.principal.username or hasAnyRole('ADMIN')")
    public UserDTO getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @GetMapping("/getbyid/{userId}")
    public UserDTO getUserById(@PathVariable String userId) {
        return userService.getUserById(userId);
    }

    @GetMapping("/getbyidsafe/{userId}")
    public UserSafeDTO getUserByIdSafe(@PathVariable String userId) {
        return userService.getUserByIdSafe(userId);
    }

    @GetMapping("/getusername/{userId}")
    public String getUsernameById(@PathVariable String userId) {
        return userService.getUsernameById(userId);
    }

    @GetMapping("/getemailbyid/{userId}")
    public String getEmailById(@PathVariable String userId) {
        return userService.getEmailById(userId);
    }

    @PutMapping("/makeadmin/{userId}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public void makeAdmin(@PathVariable String userId) {
        userService.makeAdmin(userId);
    }

}
