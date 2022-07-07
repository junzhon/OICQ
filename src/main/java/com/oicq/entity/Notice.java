package com.oicq.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Notice {
    private Integer id;
    private String from;
    private String to;
    private String msg;
    private Integer type;
    private String time;
}
