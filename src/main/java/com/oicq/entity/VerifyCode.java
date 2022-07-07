package com.oicq.entity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VerifyCode {
    private String email;
    private String code;
}
