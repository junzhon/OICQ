package com.oicq.util;

public class CodeGenerator {
    public static String codeGenerator(Integer length) {
        char[] charArray = new char[length];
        short start = (short)'0';   //0的ASCII码是48
        short end = (short)'z';    //z的ASCII码是122（0到z之间有特殊字符）
        for (int i = 0; i < length; i++) {
            while(true)
            {
                char cc1 = (char)((Math.random()*(end-start))+start);
                if(Character.isLetterOrDigit(cc1))  //判断字符是否是数字或者字母
                {
                    charArray[i] = cc1;
                    break;
                }
            }
        }
        return new String(charArray);//把字符数组转化为字符串
    }
}
