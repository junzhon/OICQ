package com.oicq.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Lobby {
    private Integer id;
    private String name;
    private String url;
    private String time;
    private String content;
}
