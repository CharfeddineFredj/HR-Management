package com.securityModel.models;

public class Notification {
    private String id;
    private String message;
    private String downloadLink;

    public Notification() {
    }
    public Notification(String message, String downloadLink) {
        this.message = message;
        this.downloadLink = downloadLink;
    }
    public Notification(String id, String message, String downloadLink) {
        this.id = id;
        this.message = message;
        this.downloadLink = downloadLink;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDownloadLink() {
        return downloadLink;
    }

    public void setDownloadLink(String downloadLink) {
        this.downloadLink = downloadLink;
    }
}
