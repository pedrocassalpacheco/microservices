package org.cloudfoundry.samples.music.web.controllers;

import java.io.IOException;
import org.cloudfoundry.samples.music.repositories.AlbumRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import org.apache.log4j.BasicConfigurator;
import org.cloudfoundry.samples.music.util.HttpHelper;


@RestController
@RequestMapping(value = "/micropayment")
public class MicroPaymentController {

    private static final Logger LOG = LoggerFactory.getLogger(MicroPaymentController.class);
    private final AlbumRepository repository;

    @Autowired
    public MicroPaymentController(AlbumRepository repository) {
        this.repository = repository;
        BasicConfigurator.configure();
        org.apache.log4j.Logger.getRootLogger().setLevel(org.apache.log4j.Level.INFO);

    }

    @RequestMapping(method = RequestMethod.GET)
    public void micropayment() throws IOException {
        processPayment();        
    }
    
    private void processPayment() throws IOException {
        HttpHelper.get("http://cart/paymentgateway");
        HttpHelper.get("http://spring-music-proxy:88/index.html");
               
    }
}
