<?php

namespace App\Events;


use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber {

   public function updateJwtData(JWTCreatedEvent $event){
       //Recupere l user
       $user = $event->getUser();

       // Enrichir notre data
       $data = $event->getData();
       $data['firstName'] = $user->getFirstName();
       $data['lastName'] = $user->getLastName();

       $event->setData($data);


   }
}