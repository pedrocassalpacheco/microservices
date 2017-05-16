/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.soickm.selenium;

import java.io.IOException;

/**
 *
 * @author root
 */
public class main {

    public static void main(String[] args) throws IOException {
        WebScrapper webSrcapper = new WebScrapper();
        webSrcapper.openTestSite();
        webSrcapper.login("admin", "12345");
        webSrcapper.getText();
        webSrcapper.saveScreenshot();
        webSrcapper.closeBrowser();

    }

}
