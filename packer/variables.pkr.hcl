variable "aws_region" {
    type    = string
}

variable "aws_ami_desc" {
    type = string
}

variable "source_ami" {
    type    = string
}

variable "ami_users" {
    type    = string 
}

variable "ssh_username" {
    type    = string
}
 
variable "subnet_id" {
    type    = string
}

variable "db_name" {
    type    = string
}

variable "db_host" {
    type    = string
}

variable "db_password" {
    type    = string
}

variable "instance_type" {
    type    = string
}
