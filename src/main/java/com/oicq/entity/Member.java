package com.oicq.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 群聊的成员
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Member {
    private Integer id;
    private Integer group_id;
    private Integer member_id;
    private String time;//加入时间
}
