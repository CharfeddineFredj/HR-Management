package com.securityModel.controllers;

import com.securityModel.models.Administrateur;
import com.securityModel.models.Announcement;
import com.securityModel.service.AnnouncementService;
import com.securityModel.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/announcement")
public class AnnouncementController {
    @Autowired
    private AnnouncementService announcementService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/all")
    public List<Announcement> ListAnnouncement(){
        return announcementService.getall();
    }

    @PostMapping("/save")
    public Announcement saveAnnouncement(@RequestBody Announcement a) {
        Announcement savedAnnouncement = announcementService.create(a);
        HashMap<String, String> notification = new HashMap<>();
        notification.put("id", savedAnnouncement.getId().toString());
        notification.put("message", savedAnnouncement.getTitle());
        messagingTemplate.convertAndSend("/topic/notifications", notification);
        return savedAnnouncement;
    }

    @GetMapping("getone/{id}")
    public Announcement getone(@PathVariable Long id){
        return announcementService.getbyId(id);
    }




    @DeleteMapping("delet/{id}")
    public HashMap<String,String> deleteAnnouncement(@PathVariable Long id) {

        HashMap message = new HashMap();
        try {
            announcementService.delete(id);
            message.put("etat", "announcement delet");
            return message;
        } catch (Exception e) {
            message.put("etat", "Error");
            return message;
        }
    }

    @PutMapping("/update")
    public Announcement updateAnnouncement(@RequestBody Announcement a) {
        return announcementService.update(a);
    }



}
