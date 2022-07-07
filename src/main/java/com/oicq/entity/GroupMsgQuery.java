package com.oicq.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 查询时的群组消息
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupMsgQuery {
    private Integer id;
    private Integer group_id;
    private Integer member_id;
    private String content;
    private String time;
    private String member_name;
    private String member_url;
}
