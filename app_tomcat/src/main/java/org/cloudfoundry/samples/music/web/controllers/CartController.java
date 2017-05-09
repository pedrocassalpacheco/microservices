package org.cloudfoundry.samples.music.web.controllers;

import org.cloudfoundry.samples.music.domain.Album;
import org.cloudfoundry.samples.music.repositories.AlbumRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.apache.log4j.BasicConfigurator;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

@RestController
@RequestMapping(value = "/cart")
public class CartController {

    private static final Logger LOG = LoggerFactory.getLogger(CartController.class);
    private final AlbumRepository repository;
    private final String USER_AGENT = "Mozilla/5.0";
    
    @Autowired
    public CartController(AlbumRepository repository) {
        this.repository = repository;
        BasicConfigurator.configure();
        org.apache.log4j.Logger.getRootLogger().setLevel(org.apache.log4j.Level.INFO);

    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Album getById(@PathVariable String id) throws MalformedURLException, IOException {
        LOG.info("Adding album to cart " + id);
        Album album = repository.findOne(id);
        addToCart(album);
        return album;
    }

    private void addToCart(Album album) throws MalformedURLException, IOException {
        String url = "http://cart?p=" + album.getAlbumId();
        
        URL obj = new URL(url);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();

        // optional default is GET
        con.setRequestMethod("GET");

        //add request header
        con.setRequestProperty("User-Agent", USER_AGENT);

        int responseCode = con.getResponseCode();
        System.out.println("\nSending 'GET' request to URL : " + url);
        System.out.println("Response Code : " + responseCode);

        try (BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()))) {
            String inputLine;
            StringBuilder response = new StringBuilder();
            
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
        }
    }
}
