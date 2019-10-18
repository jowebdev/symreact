<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * L'encoder de mot de passe
     * @var UserPasswordEncoderInterface
     */
    private $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }


    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');

        for($u=0;$u<10;$u++){
            $user = new User();
            $user->setFirstName($faker->firstName())
                ->setLastName($faker->lastName)
                ->setEmail($faker->email)
                ->setPassword($this->passwordEncoder->encodePassword($user, 'password'))
            ;
            $manager->persist($user);

            $chrono = 1;

            for($c=0;$c<mt_rand(5,20);$c++){
                $customer = new Customer();
                $customer->setFirstName($faker->firstName())
                    ->setLastName($faker->lastName)
                    ->setCompany($faker->company)
                    ->setEmail($faker->email)
                    ->setUser($user);

                $manager->persist($customer);

                for($i=0;$i<mt_rand(3,10);$i++){
                    $invoice = new Invoice();
                    $invoice->setCustomer($customer)
                        ->setAmount($faker->randomFloat(2, 250, 5000))
                        ->setSentAt($faker->dateTimeBetween('-6months'))
                        ->setChrono($chrono)
                        ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELLED']));

                    $chrono++;
                    $manager->persist($invoice);

                }

            }
        }



        $manager->flush();
    }
}
