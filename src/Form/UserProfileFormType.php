<?php

namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Length;

class UserProfileFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('firstName', TextType::class, [
                'label' => 'Prenom',
                'required' => false,
                'constraints' => [
                    new Length(max: 100),
                ],
            ])
            ->add('lastName', TextType::class, [
                'label' => 'Nom',
                'required' => false,
                'constraints' => [
                    new Length(max: 100),
                ],
            ])
            ->add('phone', TextType::class, [
                'label' => 'Telephone',
                'required' => false,
                'constraints' => [
                    new Length(max: 20),
                ],
            ])
            ->add('birthDate', DateType::class, [
                'label' => 'Date de naissance',
                'required' => false,
                'widget' => 'single_text',
                'input' => 'datetime_immutable',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}