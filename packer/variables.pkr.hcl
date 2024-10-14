variable "aws_region" {
    type    = string
    default = "us-east-1"
}

variable "source_ami" {
    type    = string
    default = "ami-0866a3c8686eaeeba" # Ubuntu 24.04 LTS
}

variable "ssh_username" {
    type    = string
    default = "ubuntu"
}

variable "subnet_id" {
    type    = string
    default = "subnet-0ebc8c671cd12fd32"
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
    default = "t2.small"
}
