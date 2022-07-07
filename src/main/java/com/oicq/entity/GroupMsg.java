package com.oicq.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 群聊消息
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupMsg {
    private Integer id;
    private Integer group_id;
    private Integer member_id;
    private String content;
    private String time;
}
